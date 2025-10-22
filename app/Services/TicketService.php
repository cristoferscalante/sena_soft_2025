<?php

namespace App\Services;

use App\Models\Tiquete;
use App\Models\Reserva;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TicketService
{
    /**
     * Generar tiquetes para una reserva
     */
    public function generarTiquetes(int $reservaId, string $formato = 'pdf'): array
    {
        $reserva = Reserva::with([
            'pasajeros.asientos.vuelo.ciudadOrigen',
            'pasajeros.asientos.vuelo.ciudadDestino',
            'pasajeros.asientos.vuelo.aeronave.modelo',
            'pagador',
            'pago',
        ])->findOrFail($reservaId);

        // Validar que la reserva esté confirmada o pagada
        if (!in_array($reserva->estado, ['pagada', 'confirmada'])) {
            throw new \RuntimeException('Solo se pueden generar tiquetes para reservas pagadas o confirmadas');
        }

        $tiquetes = [];

        foreach ($reserva->pasajeros as $pasajero) {
            foreach ($pasajero->asientos as $asiento) {
                if ($formato === 'pdf') {
                    try {
                        $tiquete = $this->generarTiquetePDF($reserva, $pasajero, $asiento->vuelo, $asiento);
                    } catch (\Exception $e) {
                        logger()->error('Error generando tiquete PDF, haciendo fallback a JSON', ['exception' => $e, 'reserva_id' => $reserva->id, 'pasajero_id' => $pasajero->id]);
                        $tiquete = $this->generarTiqueteJSON($reserva, $pasajero, $asiento->vuelo, $asiento);
                    }
                } else {
                    $tiquete = $this->generarTiqueteJSON($reserva, $pasajero, $asiento->vuelo, $asiento);
                }

                $tiquetes[] = $tiquete;
            }
        }

        return $tiquetes;
    }

    /**
     * Generar tiquete en formato PDF
     */
    protected function generarTiquetePDF($reserva, $pasajero, $vuelo, $asiento): Tiquete
    {
        // Datos del tiquete
        $datosTiquete = $this->prepararDatosTiquete($reserva, $pasajero, $vuelo, $asiento);

        // Generar PDF usando dompdf
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('tickets.pdf', $datosTiquete);
        $pdf->setPaper('a4', 'portrait');

        // Generar nombre único para el archivo
        $nombreArchivo = "tiquete_{$reserva->codigo_unico}_{$pasajero->id}_{$vuelo->id}.pdf";
        $rutaArchivo = "tickets/{$nombreArchivo}";

        // Guardar PDF real en storage
        Storage::put($rutaArchivo, $pdf->output());

        // Crear registro de tiquete
        $tiquete = Tiquete::create([
            'reserva_id' => $reserva->id,
            'pasajero_id' => $pasajero->id,
            'vuelo_id' => $vuelo->id,
            'asiento_id' => $asiento->id,
            'formato' => 'pdf',
            'url_archivo' => Storage::url($rutaArchivo),
        ]);

        return $tiquete;
    }

    /**
     * Generar tiquete en formato JSON
     */
    protected function generarTiqueteJSON($reserva, $pasajero, $vuelo, $asiento): Tiquete
    {
        $datosTiquete = $this->prepararDatosTiquete($reserva, $pasajero, $vuelo, $asiento);

        // Crear registro de tiquete con contenido JSON
        $tiquete = Tiquete::create([
            'reserva_id' => $reserva->id,
            'pasajero_id' => $pasajero->id,
            'vuelo_id' => $vuelo->id,
            'asiento_id' => $asiento->id,
            'formato' => 'json',
            'contenido_json' => $datosTiquete,
        ]);

        return $tiquete;
    }

    /**
     * Preparar datos estructurados del tiquete
     */
    protected function prepararDatosTiquete($reserva, $pasajero, $vuelo, $asiento): array
    {
        return [
            'tiquete' => [
                'codigo_reserva' => $reserva->codigo_unico,
                'fecha_emision' => now()->format('Y-m-d H:i:s'),
            ],
            'pasajero' => [
                'nombre_completo' => $pasajero->nombre_completo,
                'tipo_documento' => $pasajero->tipo_documento,
                'numero_documento' => $pasajero->numero_documento,
                'fecha_nacimiento' => $pasajero->fecha_nacimiento->format('Y-m-d'),
                'es_infante' => $pasajero->es_infante,
            ],
            'vuelo' => [
                'codigo' => $vuelo->codigo_vuelo,
                'origen' => [
                    'ciudad' => $vuelo->ciudadOrigen->nombre,
                    'codigo_iata' => $vuelo->ciudadOrigen->codigo_iata,
                    'pais' => $vuelo->ciudadOrigen->pais,
                ],
                'destino' => [
                    'ciudad' => $vuelo->ciudadDestino->nombre,
                    'codigo_iata' => $vuelo->ciudadDestino->codigo_iata,
                    'pais' => $vuelo->ciudadDestino->pais,
                ],
                'fecha_salida' => $vuelo->fecha_salida->format('Y-m-d'),
                'hora_salida' => substr($vuelo->hora_salida, 0, 5), // HH:MM
                'fecha_llegada' => $vuelo->fecha_llegada->format('Y-m-d'),
                'hora_llegada' => substr($vuelo->hora_llegada, 0, 5), // HH:MM
                'aeronave' => [
                    'matricula' => $vuelo->aeronave->matricula,
                    'modelo' => $vuelo->aeronave->modelo->nombre,
                ],
            ],
            'asiento' => [
                'numero' => $asiento->numero,
                'clase' => $asiento->clase,
            ],
            'pago' => [
                'metodo' => $reserva->pago->metodo_pago ?? 'N/A',
                'referencia' => $reserva->pago->referencia ?? 'N/A',
                'monto' => (float) ($reserva->pago->monto ?? 0),
            ],
        ];
    }

    /**
     * Obtener tiquete por código
     */
    public function obtenerTiquete(string $codigoTiquete): ?Tiquete
    {
        return Tiquete::with([
            'reserva',
            'pasajero',
            'vuelo.ciudadOrigen',
            'vuelo.ciudadDestino',
            'asiento',
        ])->where('codigo_tiquete', $codigoTiquete)->first();
    }

    /**
     * Obtener todos los tiquetes de una reserva
     */
    public function obtenerTiquetesReserva(string $codigoReserva): array
    {
        $reserva = Reserva::where('codigo_unico', $codigoReserva)->firstOrFail();

        return Tiquete::with(['pasajero', 'vuelo', 'asiento'])
            ->where('reserva_id', $reserva->id)
            ->get()
            ->map(function ($tiquete) {
                return [
                    'codigo_tiquete' => $tiquete->codigo_tiquete,
                    'formato' => $tiquete->formato,
                    'pasajero' => $tiquete->pasajero->nombre_completo,
                    'vuelo' => $tiquete->vuelo->codigo_vuelo,
                    'asiento' => $tiquete->asiento->numero,
                    'url_descarga' => $tiquete->formato === 'pdf' ? $tiquete->url_archivo : null,
                    'contenido_json' => $tiquete->formato === 'json' ? $tiquete->contenido_json : null,
                ];
            })
            ->toArray();
    }

    /**
     * Descargar tiquete
     */
    public function descargarTiquete(int $tiqueteId): array
    {
        $tiquete = Tiquete::findOrFail($tiqueteId);

        if ($tiquete->formato === 'pdf') {
            // Extraer la ruta correcta del archivo
            $rutaArchivo = str_replace('/storage/', '', $tiquete->url_archivo);

            // Verificar si el archivo existe
            if (!Storage::exists($rutaArchivo)) {
                // Si no existe, regenerar el PDF
                $tiqueteActualizado = $this->regenerarTiquetePDF($tiquete);
                $rutaArchivo = str_replace('/storage/', '', $tiqueteActualizado->url_archivo);
            }

            $contenido = Storage::get($rutaArchivo);

            return [
                'tipo' => 'pdf',
                'contenido' => $contenido,
                'nombre_archivo' => "tiquete_{$tiquete->codigo_tiquete}.pdf",
            ];
        } else {
            return [
                'tipo' => 'json',
                'contenido' => json_encode($tiquete->contenido_json, JSON_PRETTY_PRINT),
                'nombre_archivo' => "tiquete_{$tiquete->codigo_tiquete}.json",
            ];
        }
    }

    /**
     * Regenerar PDF de tiquete si no existe
     */
    protected function regenerarTiquetePDF(Tiquete $tiquete): Tiquete
    {
        $reserva = $tiquete->reserva;
        $pasajero = $tiquete->pasajero;
        $vuelo = $tiquete->vuelo;
        $asiento = $tiquete->asiento;

        // Preparar datos del tiquete
        $datosTiquete = $this->prepararDatosTiquete($reserva, $pasajero, $vuelo, $asiento);

        // Generar PDF usando dompdf
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('tickets.pdf', $datosTiquete);
        $pdf->setPaper('a4', 'portrait');

        // Generar nombre único para el archivo
        $nombreArchivo = "tiquete_{$reserva->codigo_unico}_{$pasajero->id}_{$vuelo->id}.pdf";
        $rutaArchivo = "tickets/{$nombreArchivo}";

        // Guardar PDF real en storage
        Storage::put($rutaArchivo, $pdf->output());

        // Actualizar la URL del archivo en el tiquete
        $tiquete->update(['url_archivo' => Storage::url($rutaArchivo)]);

        return $tiquete;
    }

    /**
     * Enviar tiquetes por correo
     */
    public function enviarTiquetesPorCorreo(int $reservaId, string $correo): bool
    {
        $reserva = Reserva::with(['tiquetes', 'pasajeros', 'pagador'])->findOrFail($reservaId);

        try {
            // Aquí se implementaría el envío de correo con Laravel Mail
            // Mail::to($correo)->send(new TiquetesReservaMail($reserva));

            // Por ahora simulamos que se envió correctamente
            Log::info("Tiquetes enviados a {$correo} para reserva {$reserva->codigo_unico}");

            return true;
        } catch (\Exception $e) {
            Log::error("Error al enviar tiquetes: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Generar código QR para el tiquete
     */
    protected function generarQR(string $codigoTiquete): string
    {
        // En producción, aquí se usaría una librería como SimpleSoftwareIO/simple-qrcode
        // Por ahora, retornamos una URL simulada
        return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode($codigoTiquete);
    }

    /**
     * Validar tiquete
     */
    public function validarTiquete(string $codigoTiquete): array
    {
        $tiquete = $this->obtenerTiquete($codigoTiquete);

        if (!$tiquete) {
            return [
                'valido' => false,
                'mensaje' => 'Tiquete no encontrado',
            ];
        }

        $reserva = $tiquete->reserva;

        if ($reserva->estado !== 'confirmada') {
            return [
                'valido' => false,
                'mensaje' => 'La reserva asociada no está confirmada',
            ];
        }

        return [
            'valido' => true,
            'mensaje' => 'Tiquete válido',
            'datos' => [
                'pasajero' => $tiquete->pasajero->nombre_completo,
                'vuelo' => $tiquete->vuelo->codigo_vuelo,
                'asiento' => $tiquete->asiento->numero,
                'fecha_vuelo' => $tiquete->vuelo->fecha_salida->format('d/m/Y'),
            ],
        ];
    }
}

