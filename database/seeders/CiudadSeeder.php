<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CiudadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ciudades = [
            ['nombre' => 'Bogotá', 'codigo_iata' => 'BOG', 'pais' => 'Colombia'],
            ['nombre' => 'Medellín', 'codigo_iata' => 'MDE', 'pais' => 'Colombia'],
            ['nombre' => 'Cali', 'codigo_iata' => 'CLO', 'pais' => 'Colombia'],
            ['nombre' => 'Cartagena', 'codigo_iata' => 'CTG', 'pais' => 'Colombia'],
            ['nombre' => 'Barranquilla', 'codigo_iata' => 'BAQ', 'pais' => 'Colombia'],
            ['nombre' => 'Santa Marta', 'codigo_iata' => 'SMR', 'pais' => 'Colombia'],
            ['nombre' => 'Pereira', 'codigo_iata' => 'PEI', 'pais' => 'Colombia'],
            ['nombre' => 'Bucaramanga', 'codigo_iata' => 'BGA', 'pais' => 'Colombia'],
            ['nombre' => 'Cúcuta', 'codigo_iata' => 'CUC', 'pais' => 'Colombia'],
            ['nombre' => 'Armenia', 'codigo_iata' => 'AXM', 'pais' => 'Colombia'],
            ['nombre' => 'Manizales', 'codigo_iata' => 'MZL', 'pais' => 'Colombia'],
            ['nombre' => 'Pasto', 'codigo_iata' => 'PSO', 'pais' => 'Colombia'],
            ['nombre' => 'Valledupar', 'codigo_iata' => 'VUP', 'pais' => 'Colombia'],
            ['nombre' => 'Montería', 'codigo_iata' => 'MTR', 'pais' => 'Colombia'],
            ['nombre' => 'Neiva', 'codigo_iata' => 'NVA', 'pais' => 'Colombia'],
        ];

        $timestamp = Carbon::now();

        foreach ($ciudades as &$ciudad) {
            $ciudad['created_at'] = $timestamp;
            $ciudad['updated_at'] = $timestamp;
        }

        DB::table('ciudades')->insert($ciudades);

        $this->command->info('✅ Ciudades creadas: ' . count($ciudades));
    }
}

