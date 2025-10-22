<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Vuelo;
use App\Models\ModeloAeronave;
use App\Models\Aeronave;

class VueloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Rutas principales
        $rutas = [
            ['origen' => 1, 'destino' => 2, 'codigo_base' => 'AG101'], // Bogotá - Medellín
            ['origen' => 1, 'destino' => 3, 'codigo_base' => 'AG102'], // Bogotá - Cali
            ['origen' => 1, 'destino' => 4, 'codigo_base' => 'AG103'], // Bogotá - Cartagena
            ['origen' => 2, 'destino' => 1, 'codigo_base' => 'AG201'], // Medellín - Bogotá
            ['origen' => 2, 'destino' => 4, 'codigo_base' => 'AG202'], // Medellín - Cartagena
            ['origen' => 3, 'destino' => 1, 'codigo_base' => 'AG301'], // Cali - Bogotá
            ['origen' => 4, 'destino' => 1, 'codigo_base' => 'AG401'], // Cartagena - Bogotá
            ['origen' => 5, 'destino' => 1, 'codigo_base' => 'AG501'], // Barranquilla - Bogotá
        ];

        $aeronaves = DB::table('aeronaves')->where('estado', 'activo')->pluck('id')->toArray();
        $vuelos = [];

        // Crear vuelos para los próximos 60 días
        $fechaInicio = Carbon::today();
        $fechaFin = Carbon::today()->addDays(60);

        foreach ($rutas as $ruta) {
            $fecha = $fechaInicio->copy();
            
            while ($fecha->lte($fechaFin)) {
                // Vuelo de la mañana
                $aeronaveId = $aeronaves[array_rand($aeronaves)];
                $aeronave = Aeronave::with('modelo')->find($aeronaveId);
                
                $vuelos[] = [
                    'codigo_vuelo' => $ruta['codigo_base'] . '-M',
                    'origen_ciudad_id' => $ruta['origen'],
                    'destino_ciudad_id' => $ruta['destino'],
                    'aeronave_id' => $aeronaveId,
                    'fecha_salida' => $fecha->toDateString(),
                    'hora_salida' => '08:00:00',
                    'fecha_llegada' => $fecha->toDateString(),
                    'hora_llegada' => '09:30:00',
                    'precio_base' => rand(150000, 350000),
                    'capacidad_total' => $aeronave->modelo->capacidad_total,
                    'asientos_disponibles' => $aeronave->modelo->capacidad_total,
                    'estado' => 'programado',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];

                // Vuelo de la tarde
                $aeronaveId = $aeronaves[array_rand($aeronaves)];
                $aeronave = Aeronave::with('modelo')->find($aeronaveId);
                
                $vuelos[] = [
                    'codigo_vuelo' => $ruta['codigo_base'] . '-T',
                    'origen_ciudad_id' => $ruta['origen'],
                    'destino_ciudad_id' => $ruta['destino'],
                    'aeronave_id' => $aeronaveId,
                    'fecha_salida' => $fecha->toDateString(),
                    'hora_salida' => '16:00:00',
                    'fecha_llegada' => $fecha->toDateString(),
                    'hora_llegada' => '17:30:00',
                    'precio_base' => rand(150000, 350000),
                    'capacidad_total' => $aeronave->modelo->capacidad_total,
                    'asientos_disponibles' => $aeronave->modelo->capacidad_total,
                    'estado' => 'programado',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];

                $fecha->addDays(1);
            }
        }

        // Insertar vuelos en lotes
        $chunks = array_chunk($vuelos, 100);
        foreach ($chunks as $chunk) {
            DB::table('vuelos')->insert($chunk);
        }

        $this->command->info('✅ Vuelos creados: ' . count($vuelos));

        // Generar asientos para cada vuelo
        $this->generarAsientos();
    }

    /**
     * Generar asientos para todos los vuelos
     */
    protected function generarAsientos(): void
    {
        $vuelos = Vuelo::with('aeronave.modelo')->get();
        $totalAsientos = 0;

        foreach ($vuelos as $vuelo) {
            $modelo = $vuelo->aeronave->modelo;
            $asientos = [];
            $letras = range('A', 'Z');

            for ($fila = 1; $fila <= $modelo->filas; $fila++) {
                for ($col = 0; $col < $modelo->asientos_por_fila; $col++) {
                    $asientos[] = [
                        'vuelo_id' => $vuelo->id,
                        'numero' => $fila . $letras[$col],
                        'clase' => 'economica',
                        'estado' => 'disponible',
                        'version' => 0,
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
                }
            }

            DB::table('asientos')->insert($asientos);
            $totalAsientos += count($asientos);
        }

        $this->command->info('✅ Asientos generados: ' . $totalAsientos);
    }
}

