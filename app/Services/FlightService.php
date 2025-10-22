<?php

namespace App\Services;

use App\Models\Vuelo;
use App\Models\Ciudad;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;

class FlightService
{
    /**
     * Buscar vuelos disponibles
     */
    public function buscarVuelos(int $origenId, int $destinoId, string $fecha, int $pasajeros = 1): Collection
    {
        // Validar que la fecha esté en el rango permitido (hoy + 60 días)
        $fechaBusqueda = Carbon::parse($fecha);
        $fechaMinima = Carbon::today();
        $fechaMaxima = Carbon::today()->addDays(60);

        if ($fechaBusqueda->lt($fechaMinima) || $fechaBusqueda->gt($fechaMaxima)) {
            throw new \InvalidArgumentException('La fecha debe estar entre hoy y 60 días adelante');
        }

        // Validar que origen != destino
        if ($origenId === $destinoId) {
            throw new \InvalidArgumentException('La ciudad de origen y destino deben ser diferentes');
        }

        // Buscar vuelos (con caché de 5 minutos)
        $cacheKey = "vuelos:{$origenId}:{$destinoId}:{$fecha}:{$pasajeros}";
        
        return Cache::remember($cacheKey, 300, function () use ($origenId, $destinoId, $fecha, $pasajeros) {
            return Vuelo::with(['ciudadOrigen', 'ciudadDestino', 'aeronave.modelo'])
                ->buscar($origenId, $destinoId, $fecha)
                ->disponibles()
                ->where('asientos_disponibles', '>=', $pasajeros)
                ->orderBy('hora_salida')
                ->get()
                ->map(function ($vuelo) {
                    return [
                        'id' => $vuelo->id,
                        'codigo_vuelo' => $vuelo->codigo_vuelo,
                        'origen' => [
                            'id' => $vuelo->ciudadOrigen->id,
                            'nombre' => $vuelo->ciudadOrigen->nombre,
                            'codigo_iata' => $vuelo->ciudadOrigen->codigo_iata,
                        ],
                        'destino' => [
                            'id' => $vuelo->ciudadDestino->id,
                            'nombre' => $vuelo->ciudadDestino->nombre,
                            'codigo_iata' => $vuelo->ciudadDestino->codigo_iata,
                        ],
                        'fecha_salida' => $vuelo->fecha_salida->format('Y-m-d'),
                        'hora_salida' => $vuelo->hora_salida->format('H:i'),
                        'fecha_llegada' => $vuelo->fecha_llegada->format('Y-m-d'),
                        'hora_llegada' => $vuelo->hora_llegada->format('H:i'),
                        'precio_base' => (float) $vuelo->precio_base,
                        'asientos_disponibles' => $vuelo->asientos_disponibles,
                        'capacidad_total' => $vuelo->capacidad_total,
                        'aeronave' => [
                            'matricula' => $vuelo->aeronave->matricula,
                            'modelo' => $vuelo->aeronave->modelo->nombre,
                        ],
                    ];
                });
        });
    }

    /**
     * Obtener ciudades para autocompletado
     */
    public function buscarCiudades(string $termino = ''): Collection
    {
        return Cache::remember("ciudades:buscar:{$termino}", 3600, function () use ($termino) {
            $query = Ciudad::orderBy('nombre');

            if (!empty($termino)) {
                $query->where(function ($q) use ($termino) {
                    $q->where('nombre', 'LIKE', "%{$termino}%")
                      ->orWhere('codigo_iata', 'LIKE', "%{$termino}%");
                });
            }

            return $query->limit(20)->get()->map(function ($ciudad) {
                return [
                    'id' => $ciudad->id,
                    'nombre' => $ciudad->nombre,
                    'codigo_iata' => $ciudad->codigo_iata,
                    'pais' => $ciudad->pais,
                    'label' => "{$ciudad->nombre} ({$ciudad->codigo_iata}) - {$ciudad->pais}",
                ];
            });
        });
    }

    /**
     * Obtener todas las ciudades
     */
    public function obtenerTodasCiudades(): Collection
    {
        return Cache::remember('ciudades:todas', 86400, function () {
            return Ciudad::orderBy('nombre')->get();
        });
    }

    /**
     * Obtener detalles de un vuelo
     */
    public function obtenerDetallesVuelo(int $vueloId): ?array
    {
        $vuelo = Vuelo::with([
            'ciudadOrigen',
            'ciudadDestino',
            'aeronave.modelo',
            'asientos' => function ($query) {
                $query->orderBy('numero');
            }
        ])->find($vueloId);

        if (!$vuelo) {
            return null;
        }

        return [
            'id' => $vuelo->id,
            'codigo_vuelo' => $vuelo->codigo_vuelo,
            'origen' => [
                'id' => $vuelo->ciudadOrigen->id,
                'nombre' => $vuelo->ciudadOrigen->nombre,
                'codigo_iata' => $vuelo->ciudadOrigen->codigo_iata,
            ],
            'destino' => [
                'id' => $vuelo->ciudadDestino->id,
                'nombre' => $vuelo->ciudadDestino->nombre,
                'codigo_iata' => $vuelo->ciudadDestino->codigo_iata,
            ],
            'fecha_salida' => $vuelo->fecha_salida->format('Y-m-d'),
            'hora_salida' => $vuelo->hora_salida->format('H:i'),
            'fecha_llegada' => $vuelo->fecha_llegada->format('Y-m-d'),
            'hora_llegada' => $vuelo->hora_llegada->format('H:i'),
            'precio_base' => (float) $vuelo->precio_base,
            'asientos_disponibles' => $vuelo->asientos_disponibles,
            'capacidad_total' => $vuelo->capacidad_total,
            'estado' => $vuelo->estado,
            'aeronave' => [
                'matricula' => $vuelo->aeronave->matricula,
                'modelo' => [
                    'nombre' => $vuelo->aeronave->modelo->nombre,
                    'fabricante' => $vuelo->aeronave->modelo->fabricante,
                    'capacidad' => $vuelo->aeronave->modelo->capacidad_total,
                    'filas' => $vuelo->aeronave->modelo->filas,
                    'asientos_por_fila' => $vuelo->aeronave->modelo->asientos_por_fila,
                ],
            ],
            'asientos' => $vuelo->asientos->map(function ($asiento) {
                return [
                    'id' => $asiento->id,
                    'numero' => $asiento->numero,
                    'clase' => $asiento->clase,
                    'estado' => $asiento->estado,
                ];
            }),
        ];
    }

    /**
     * Validar disponibilidad de un vuelo para cierta cantidad de pasajeros
     */
    public function validarDisponibilidad(int $vueloId, int $cantidadPasajeros): bool
    {
        $vuelo = Vuelo::find($vueloId);
        
        if (!$vuelo) {
            return false;
        }

        return $vuelo->asientos_disponibles >= $cantidadPasajeros 
            && $vuelo->estado === 'programado'
            && $vuelo->fecha_salida >= Carbon::today();
    }
}

