<?php

namespace App\Services;

use App\Models\Asiento;
use App\Models\Vuelo;
use App\Models\Reserva;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;

class SeatService
{
    /**
     * Obtener mapa de asientos de un vuelo
     */
    public function obtenerMapaAsientos(int $vueloId): array
    {
        $vuelo = Vuelo::with(['aeronave.modelo', 'asientos'])->findOrFail($vueloId);

        $modelo = $vuelo->aeronave->modelo;

        return [
            'vuelo_id' => $vuelo->id,
            'codigo_vuelo' => $vuelo->codigo_vuelo,
            'configuracion' => [
                'filas' => $modelo->filas,
                'asientos_por_fila' => $modelo->asientos_por_fila,
                'capacidad_total' => $modelo->capacidad_total,
            ],
            'asientos' => $vuelo->asientos->map(function ($asiento) {
                return [
                    'id' => $asiento->id,
                    'numero' => $asiento->numero,
                    'clase' => $asiento->clase,
                    'estado' => $asiento->estado,
                    'version' => $asiento->version,
                    'reservado_at' => $asiento->reservado_at?->toIso8601String(),
                ];
            })->groupBy(function ($asiento) {
                // Agrupar por fila (extraer número de la fila del número de asiento)
                return intval(preg_replace('/[^0-9]/', '', $asiento['numero']));
            }),
        ];
    }

    /**
     * Reservar asientos con control de concurrencia (Optimistic Locking)
     */
    public function reservarAsientos(array $asientoIds, int $reservaId): array
    {
        $asientosReservados = [];
        $asientosFallidos = [];

        DB::transaction(function () use ($asientoIds, $reservaId, &$asientosReservados, &$asientosFallidos) {
            foreach ($asientoIds as $asientoId) {
                try {
                    // Bloquear el asiento con optimistic locking
                    $asiento = Asiento::where('id', $asientoId)
                        ->where('estado', 'disponible')
                        ->lockForUpdate()
                        ->first();

                    if (!$asiento) {
                        $asientosFallidos[] = [
                            'id' => $asientoId,
                            'razon' => 'Asiento no disponible o no existe',
                        ];
                        continue;
                    }

                    // Actualizar asiento (incrementando versión para optimistic locking)
                    $updated = Asiento::where('id', $asientoId)
                        ->where('version', $asiento->version)
                        ->where('estado', 'disponible')
                        ->update([
                            'estado' => 'reservado',
                            'reserva_id' => $reservaId,
                            'reservado_at' => now(),
                            'version' => $asiento->version + 1,
                        ]);

                    if ($updated) {
                        $asientosReservados[] = $asiento->refresh();
                        
                        // Actualizar contador de asientos disponibles del vuelo
                        Vuelo::where('id', $asiento->vuelo_id)
                            ->decrement('asientos_disponibles');
                    } else {
                        $asientosFallidos[] = [
                            'id' => $asientoId,
                            'razon' => 'Conflicto de concurrencia',
                        ];
                    }
                } catch (\Exception $e) {
                    $asientosFallidos[] = [
                        'id' => $asientoId,
                        'razon' => $e->getMessage(),
                    ];
                }
            }

            // Si algún asiento falló, hacer rollback
            if (!empty($asientosFallidos)) {
                throw new \RuntimeException('No se pudieron reservar todos los asientos: ' . json_encode($asientosFallidos));
            }
        });

        return [
            'success' => empty($asientosFallidos),
            'asientos_reservados' => $asientosReservados,
            'asientos_fallidos' => $asientosFallidos,
        ];
    }

    /**
     * Liberar asientos de una reserva
     */
    public function liberarAsientos(int $reservaId): int
    {
        $asientos = Asiento::where('reserva_id', $reservaId)->get();

        $cantidadLiberada = 0;

        DB::transaction(function () use ($asientos, $reservaId, &$cantidadLiberada) {
            foreach ($asientos as $asiento) {
                $updated = Asiento::where('id', $asiento->id)
                    ->update([
                        'estado' => 'disponible',
                        'reserva_id' => null,
                        'reservado_at' => null,
                    ]);

                if ($updated) {
                    // Incrementar contador de asientos disponibles del vuelo
                    Vuelo::where('id', $asiento->vuelo_id)
                        ->increment('asientos_disponibles');
                    
                    $cantidadLiberada++;
                }
            }
        });

        return $cantidadLiberada;
    }

    /**
     * Confirmar asientos (cambiar estado a "emitido")
     */
    public function confirmarAsientos(int $reservaId): int
    {
        return Asiento::where('reserva_id', $reservaId)
            ->where('estado', 'reservado')
            ->update(['estado' => 'emitido']);
    }

    /**
     * Asignar asiento a pasajero
     */
    public function asignarAsientoAPasajero(int $asientoId, int $pasajeroId): bool
    {
        try {
            $asiento = Asiento::findOrFail($asientoId);
            $asiento->pasajeros()->attach($pasajeroId);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Verificar disponibilidad de asientos específicos
     */
    public function verificarDisponibilidad(array $asientoIds): array
    {
        $asientos = Asiento::whereIn('id', $asientoIds)->get();

        return $asientos->map(function ($asiento) {
            return [
                'id' => $asiento->id,
                'numero' => $asiento->numero,
                'disponible' => $asiento->estado === 'disponible',
                'estado' => $asiento->estado,
            ];
        })->toArray();
    }

    /**
     * Generar asientos automáticamente para un vuelo
     */
    public function generarAsientosParaVuelo(int $vueloId): int
    {
        $vuelo = Vuelo::with('aeronave.modelo')->findOrFail($vueloId);
        $modelo = $vuelo->aeronave->modelo;

        $asientos = [];
        $letras = range('A', 'Z');

        for ($fila = 1; $fila <= $modelo->filas; $fila++) {
            for ($col = 0; $col < $modelo->asientos_por_fila; $col++) {
                $asientos[] = [
                    'vuelo_id' => $vueloId,
                    'numero' => $fila . $letras[$col],
                    'clase' => 'economica',
                    'estado' => 'disponible',
                    'version' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        return DB::table('asientos')->insert($asientos);
    }
}

