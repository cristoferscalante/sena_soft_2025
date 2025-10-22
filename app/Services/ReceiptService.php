<?php

namespace App\Services;

use App\Models\Pago;
use App\Models\Reserva;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReceiptService
{
    /**
     * Generar recibo de compra en PDF
     */
    public function generarReciboPDF(int $pagoId): array
    {
        $pago = Pago::with([
            'reserva.pasajeros.asientos.vuelo.ciudadOrigen',
            'reserva.pasajeros.asientos.vuelo.ciudadDestino',
            'reserva.pasajeros.asientos.vuelo.aeronave.modelo',
            'reserva.pagador'
        ])->findOrFail($pagoId);

        // Validar que el pago esté aprobado
        if (!$pago->estaAprobado()) {
            throw new \RuntimeException('Solo se pueden generar recibos para pagos aprobados');
        }

        // Preparar datos para el recibo
        $datosRecibo = $this->prepararDatosRecibo($pago);

        // Generar PDF usando dompdf
        $pdf = Pdf::loadView('receipts.payment', $datosRecibo);
        $pdf->setPaper('a4', 'portrait');

        // Generar nombre único para el archivo
        $nombreArchivo = "recibo_{$pago->referencia}.pdf";
        $rutaArchivo = "receipts/{$nombreArchivo}";

        // Guardar PDF en storage
        Storage::put($rutaArchivo, $pdf->output());

        return [
            'success' => true,
            'archivo' => $nombreArchivo,
            'ruta' => $rutaArchivo,
            'url' => Storage::url($rutaArchivo),
            'contenido' => $pdf->output(),
        ];
    }

    /**
     * Preparar datos estructurados del recibo
     */
    protected function prepararDatosRecibo(Pago $pago): array
    {
        $reserva = $pago->reserva;

        // Separar adultos e infantes
        $adultos = $reserva->pasajeros->filter(fn($p) => !$p->es_infante);
        $infantes = $reserva->pasajeros->filter(fn($p) => $p->es_infante);

        // Obtener información de vuelos únicos
        $vuelos = $reserva->pasajeros->flatMap(function ($pasajero) {
            return $pasajero->asientos->map(function ($asiento) {
                return $asiento->vuelo;
            });
        })->unique('id')->values();

        // Calcular desglose por vuelo
        $desgloseVuelos = $vuelos->map(function ($vuelo) use ($adultos) {
            $precioUnitario = (float) $vuelo->precio_base;
            $cantidadAdultos = $adultos->count();
            $subtotal = $precioUnitario * $cantidadAdultos;
            
            return [
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
                'precio_unitario' => $precioUnitario,
                'cantidad_adultos' => $cantidadAdultos,
                'subtotal' => $subtotal,
            ];
        })->toArray();

        $subtotalVuelos = collect($desgloseVuelos)->sum('subtotal');

        return [
            'recibo' => [
                'numero' => $pago->referencia,
                'fecha_emision' => now()->format('Y-m-d H:i:s'),
                'fecha_pago' => $pago->fecha_pago->format('Y-m-d H:i:s'),
            ],
            'empresa' => [
                'nombre' => 'AirGuider',
                'nit' => '900.123.456-7',
                'direccion' => 'Calle 123 #45-67, Bogotá, Colombia',
                'telefono' => '+57 (1) 234-5678',
                'email' => 'info@airguider.com',
                'web' => 'www.airguider.com',
            ],
            'cliente' => [
                'nombre' => $reserva->pagador->nombre_completo,
                'documento' => $reserva->pagador->tipo_documento . ' ' . $reserva->pagador->numero_documento,
                'email' => $reserva->pagador->correo,
                'telefono' => $reserva->pagador->telefono,
            ],
            'reserva' => [
                'codigo' => $reserva->codigo_unico,
                'fecha_creacion' => $reserva->created_at->format('Y-m-d H:i:s'),
                'estado' => $reserva->estado,
                'total_pasajeros' => $reserva->pasajeros->count(),
                'cantidad_adultos' => $adultos->count(),
                'cantidad_infantes' => $infantes->count(),
            ],
            'vuelos' => $desgloseVuelos,
            'pasajeros' => $reserva->pasajeros->map(function ($pasajero) {
                return [
                    'nombre' => $pasajero->nombre_completo,
                    'documento' => $pasajero->tipo_documento . ' ' . $pasajero->numero_documento,
                    'es_infante' => $pasajero->es_infante,
                    'asientos' => $pasajero->asientos->map(function ($asiento) {
                        return [
                            'numero' => $asiento->numero,
                            'clase' => $asiento->clase,
                            'vuelo' => $asiento->vuelo->codigo_vuelo,
                        ];
                    })->toArray(),
                ];
            })->toArray(),
            'pago' => [
                'metodo' => $this->formatearMetodoPago($pago->metodo_pago),
                'referencia' => $pago->referencia,
                'estado' => $pago->estado,
                'datos_adicionales' => $pago->datos_pago_json,
            ],
            'totales' => [
                'subtotal' => $subtotalVuelos,
                'total' => (float) $reserva->total,
                'moneda' => 'COP',
            ],
        ];
    }

    /**
     * Formatear método de pago para mostrar
     */
    protected function formatearMetodoPago(string $metodoPago): string
    {
        $metodos = [
            'tarjeta_credito' => 'Tarjeta de Crédito',
            'tarjeta_debito' => 'Tarjeta de Débito',
            'pse' => 'PSE - Pagos Seguros en Línea',
        ];

        return $metodos[$metodoPago] ?? ucfirst(str_replace('_', ' ', $metodoPago));
    }

    /**
     * Descargar recibo existente
     */
    public function descargarRecibo(string $referenciaPago): array
    {
        $pago = Pago::where('referencia', $referenciaPago)->firstOrFail();

        $nombreArchivo = "recibo_{$pago->referencia}.pdf";
        $rutaArchivo = "receipts/{$nombreArchivo}";

        // Verificar si el archivo existe
        if (!Storage::exists($rutaArchivo)) {
            // Si no existe, generarlo
            $resultado = $this->generarReciboPDF($pago->id);
            return [
                'contenido' => $resultado['contenido'],
                'nombre_archivo' => $nombreArchivo,
                'tipo' => 'pdf',
            ];
        }

        // Si existe, devolverlo
        $contenido = Storage::get($rutaArchivo);

        return [
            'contenido' => $contenido,
            'nombre_archivo' => $nombreArchivo,
            'tipo' => 'pdf',
        ];
    }

    /**
     * Obtener información del recibo
     */
    public function obtenerInfoRecibo(string $referenciaPago): array
    {
        $pago = Pago::with('reserva')->where('referencia', $referenciaPago)->firstOrFail();

        return [
            'referencia' => $pago->referencia,
            'fecha_pago' => $pago->fecha_pago->format('d/m/Y H:i'),
            'monto' => $pago->monto,
            'metodo_pago' => $this->formatearMetodoPago($pago->metodo_pago),
            'estado' => $pago->estado,
            'codigo_reserva' => $pago->reserva->codigo_unico,
        ];
    }

    /**
     * Listar recibos de una reserva
     */
    public function obtenerRecibosReserva(string $codigoReserva): array
    {
        $reserva = Reserva::where('codigo_unico', $codigoReserva)->firstOrFail();

        $pagos = Pago::where('reserva_id', $reserva->id)
            ->where('estado', 'aprobado')
            ->orderBy('created_at', 'desc')
            ->get();

        return $pagos->map(function ($pago) {
            return [
                'referencia' => $pago->referencia,
                'fecha_pago' => $pago->fecha_pago->format('d/m/Y H:i'),
                'monto' => $pago->monto,
                'metodo_pago' => $this->formatearMetodoPago($pago->metodo_pago),
                'url_descarga' => route('receipts.download', ['referencia' => $pago->referencia]),
            ];
        })->toArray();
    }
}