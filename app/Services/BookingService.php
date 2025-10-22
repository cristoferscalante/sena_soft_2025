<?php

namespace App\Services;

use App\Models\Reserva;
use App\Models\Pagador;
use App\Models\Pasajero;
use App\Models\Vuelo;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingService
{
    protected SeatService $seatService;

    public function __construct(SeatService $seatService)
    {
        $this->seatService = $seatService;
    }

    /**
     * Crear una reserva completa
     */
    public function crearReserva(array $datos): Reserva
    {
        return DB::transaction(function () use ($datos) {
            // 1. Crear o buscar pagador
            $pagador = Pagador::firstOrCreate(
                [
                    'tipo_documento' => $datos['pagador']['tipo_documento'],
                    'numero_documento' => $datos['pagador']['numero_documento'],
                ],
                [
                    'nombre_completo' => $datos['pagador']['nombre_completo'],
                    'correo' => $datos['pagador']['correo'],
                    'telefono' => $datos['pagador']['telefono'],
                ]
            );

            // 2. Calcular total (infantes no pagan)
            $total = 0;
            $pasajerosQueNoSonInfantes = 0;

            foreach ($datos['pasajeros'] as $pasajeroData) {
                // Calcular si es infante automáticamente
                $fechaNacimiento = Carbon::parse($pasajeroData['fecha_nacimiento']);
                $edad = $fechaNacimiento->diffInYears(Carbon::now());
                $esInfante = $edad < 3;

                if (!$esInfante) {
                    $pasajerosQueNoSonInfantes++;
                }
            }

            foreach ($datos['vuelos'] as $vueloData) {
                $vuelo = Vuelo::find($vueloData['vuelo_id']);
                $total += $vuelo->precio_base * $pasajerosQueNoSonInfantes;
            }

            // 3. Crear reserva
            $reserva = Reserva::create([
                'pagador_id' => $pagador->id,
                'total' => $total,
                'cantidad_pasajeros' => count($datos['pasajeros']),
                'terminos_aceptados' => $datos['terminos_aceptados'] ?? false,
                'estado' => 'pendiente',
            ]);

            // 4. Asociar vuelos a la reserva
            foreach ($datos['vuelos'] as $vueloData) {
                $reserva->vuelos()->attach($vueloData['vuelo_id'], [
                    'tipo_viaje' => $vueloData['tipo_viaje'] ?? 'ida',
                ]);
            }

            // 5. Crear pasajeros (calcular es_infante automáticamente)
            foreach ($datos['pasajeros'] as $pasajeroData) {
                // Calcular edad y determinar si es infante
                $fechaNacimiento = Carbon::parse($pasajeroData['fecha_nacimiento']);
                $edad = $fechaNacimiento->diffInYears(Carbon::now());
                $esInfante = $edad < 3;

                Pasajero::create([
                    'reserva_id' => $reserva->id,
                    'primer_apellido' => $pasajeroData['primer_apellido'],
                    'segundo_apellido' => $pasajeroData['segundo_apellido'] ?? null,
                    'nombres' => $pasajeroData['nombres'],
                    'fecha_nacimiento' => $pasajeroData['fecha_nacimiento'],
                    'genero' => $pasajeroData['genero'],
                    'tipo_documento' => $pasajeroData['tipo_documento'],
                    'numero_documento' => $pasajeroData['numero_documento'],
                    'es_infante' => $esInfante,
                    'celular' => $pasajeroData['celular'],
                    'correo' => $pasajeroData['correo'],
                ]);
            }

            // 6. Reservar asientos si se proporcionan (infantes no ocupan asiento)
            if (isset($datos['asientos']) && !empty($datos['asientos'])) {
                $resultado = $this->seatService->reservarAsientos($datos['asientos'], $reserva->id);

                if (!$resultado['success']) {
                    throw new \RuntimeException('Error al reservar asientos: ' . json_encode($resultado['asientos_fallidos']));
                }

                // Asignar asientos a pasajeros (solo a los que no son infantes)
                $pasajeros = $reserva->pasajeros;
                $pasajerosNoInfantes = $pasajeros->filter(function($pasajero) {
                    return !$pasajero->es_infante;
                })->values();

                foreach ($resultado['asientos_reservados'] as $index => $asiento) {
                    if (isset($pasajerosNoInfantes[$index])) {
                        $this->seatService->asignarAsientoAPasajero($asiento->id, $pasajerosNoInfantes[$index]->id);
                    }
                }
            }

            return $reserva->load(['pagador', 'pasajeros', 'vuelos', 'asientos']);
        });
    }

    /**
     * Obtener detalles completos de una reserva
     */
    public function obtenerReserva(string $codigoUnico): ?Reserva
    {
        return Reserva::with([
            'pagador',
            'pasajeros.asientos',
            'vuelos.ciudadOrigen',
            'vuelos.ciudadDestino',
            'vuelos.aeronave.modelo',
            'asientos',
            'pago',
            'tiquetes',
        ])->where('codigo_unico', $codigoUnico)->first();
    }

    /**
     * Confirmar reserva tras pago exitoso
     */
    public function confirmarReserva(int $reservaId): bool
    {
        return DB::transaction(function () use ($reservaId) {
            $reserva = Reserva::findOrFail($reservaId);

            // Actualizar estado de reserva
            $reserva->update(['estado' => 'confirmada']);

            // Cambiar estado de asientos a "emitido"
            $this->seatService->confirmarAsientos($reservaId);

            return true;
        });
    }

    /**
     * Cancelar reserva
     */
    public function cancelarReserva(int $reservaId): bool
    {
        return DB::transaction(function () use ($reservaId) {
            $reserva = Reserva::findOrFail($reservaId);

            // Liberar asientos
            $this->seatService->liberarAsientos($reservaId);

            // Actualizar estado
            $reserva->update(['estado' => 'cancelada']);

            return true;
        });
    }

    /**
     * Liberar reservas expiradas
     */
    public function liberarReservasExpiradas(): int
    {
        $reservasExpiradas = Reserva::expiradas()->get();

        $contador = 0;

        foreach ($reservasExpiradas as $reserva) {
            DB::transaction(function () use ($reserva) {
                // Liberar asientos
                $this->seatService->liberarAsientos($reserva->id);

                // Marcar como expirada
                $reserva->update(['estado' => 'expirada']);
            });

            $contador++;
        }

        return $contador;
    }

    /**
     * Validar datos de reserva
     */
    public function validarDatosReserva(array $datos): array
    {
        $errores = [];

        // Validar cantidad de pasajeros
        if (!isset($datos['pasajeros']) || count($datos['pasajeros']) < 1 || count($datos['pasajeros']) > 5) {
            $errores[] = 'La cantidad de pasajeros debe ser entre 1 y 5';
        }

        // Validar vuelos
        if (!isset($datos['vuelos']) || empty($datos['vuelos'])) {
            $errores[] = 'Debe seleccionar al menos un vuelo';
        }

        // Validar capacidad de vuelos
        if (isset($datos['vuelos']) && isset($datos['pasajeros'])) {
            foreach ($datos['vuelos'] as $vueloData) {
                $vuelo = Vuelo::find($vueloData['vuelo_id']);
                if ($vuelo && $vuelo->asientos_disponibles < count($datos['pasajeros'])) {
                    $errores[] = "El vuelo {$vuelo->codigo_vuelo} no tiene suficientes asientos disponibles";
                }
            }
        }

        // Validar términos y condiciones
        if (!isset($datos['terminos_aceptados']) || !$datos['terminos_aceptados']) {
            $errores[] = 'Debe aceptar los términos y condiciones';
        }

        // Validar edad de infantes
        if (isset($datos['pasajeros'])) {
            foreach ($datos['pasajeros'] as $index => $pasajeroData) {
                if (isset($pasajeroData['es_infante']) && $pasajeroData['es_infante']) {
                    $fechaNacimiento = Carbon::parse($pasajeroData['fecha_nacimiento']);
                    $edad = $fechaNacimiento->diffInYears(Carbon::now());
                    if ($edad >= 3) {
                        $errores[] = "El pasajero " . ($index + 1) . " está marcado como infante pero tiene {$edad} años";
                    }
                }
            }
        }

        return [
            'valido' => empty($errores),
            'errores' => $errores,
        ];
    }

    /**
     * Obtener resumen de reserva para confirmación
     */
    public function obtenerResumenReserva(int $reservaId): array
    {
        $reserva = Reserva::with([
            'pagador',
            'pasajeros.asientos.vuelo',
            'vuelos.ciudadOrigen',
            'vuelos.ciudadDestino',
            'pago',
        ])->findOrFail($reservaId);

        return [
            'codigo_reserva' => $reserva->codigo_unico,
            'estado' => $reserva->estado,
            'total' => (float) $reserva->total,
            'cantidad_pasajeros' => $reserva->cantidad_pasajeros,
            'pagador' => [
                'nombre' => $reserva->pagador->nombre_completo,
                'documento' => $reserva->pagador->tipo_documento . ' ' . $reserva->pagador->numero_documento,
                'correo' => $reserva->pagador->correo,
                'telefono' => $reserva->pagador->telefono,
            ],
            'vuelos' => $reserva->vuelos->map(function ($vuelo) {
                return [
                    'codigo' => $vuelo->codigo_vuelo,
                    'origen' => $vuelo->ciudadOrigen->nombre . ' (' . $vuelo->ciudadOrigen->codigo_iata . ')',
                    'destino' => $vuelo->ciudadDestino->nombre . ' (' . $vuelo->ciudadDestino->codigo_iata . ')',
                    'fecha_salida' => $vuelo->fecha_salida->format('d/m/Y'),
                    'hora_salida' => substr($vuelo->hora_salida, 0, 5), // HH:MM
                ];
            }),
            'pasajeros' => $reserva->pasajeros->map(function ($pasajero) {
                return [
                    'nombre_completo' => $pasajero->nombre_completo,
                    'documento' => $pasajero->tipo_documento . ' ' . $pasajero->numero_documento,
                    'asientos' => $pasajero->asientos->map(function ($asiento) {
                        return [
                            'numero' => $asiento->numero,
                            'vuelo' => $asiento->vuelo->codigo_vuelo,
                        ];
                    }),
                ];
            }),
            'pago' => $reserva->pago ? [
                'metodo' => $reserva->pago->metodo_pago,
                'estado' => $reserva->pago->estado,
                'referencia' => $reserva->pago->referencia,
                'fecha' => $reserva->pago->fecha_pago->format('d/m/Y H:i'),
            ] : null,
        ];
    }
}

