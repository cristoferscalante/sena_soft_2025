<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ModeloAeronaveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modelos = [
            [
                'nombre' => 'Boeing 737-800',
                'fabricante' => 'Boeing',
                'capacidad_total' => 180,
                'filas' => 30,
                'asientos_por_fila' => 6,
            ],
            [
                'nombre' => 'Airbus A320',
                'fabricante' => 'Airbus',
                'capacidad_total' => 150,
                'filas' => 25,
                'asientos_por_fila' => 6,
            ],
            [
                'nombre' => 'Embraer E190',
                'fabricante' => 'Embraer',
                'capacidad_total' => 100,
                'filas' => 25,
                'asientos_por_fila' => 4,
            ],
            [
                'nombre' => 'ATR 72-600',
                'fabricante' => 'ATR',
                'capacidad_total' => 72,
                'filas' => 18,
                'asientos_por_fila' => 4,
            ],
        ];

        $timestamp = Carbon::now();

        foreach ($modelos as &$modelo) {
            $modelo['created_at'] = $timestamp;
            $modelo['updated_at'] = $timestamp;
        }

        DB::table('modelos_aeronave')->insert($modelos);

        $this->command->info('✅ Modelos de aeronave creados: ' . count($modelos));
    }
}

