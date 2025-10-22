<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AeronaveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aeronaves = [
            ['modelo_id' => 1, 'matricula' => 'HK-5050', 'anio_fabricacion' => 2018, 'estado' => 'activo'],
            ['modelo_id' => 1, 'matricula' => 'HK-5051', 'anio_fabricacion' => 2019, 'estado' => 'activo'],
            ['modelo_id' => 2, 'matricula' => 'HK-5100', 'anio_fabricacion' => 2020, 'estado' => 'activo'],
            ['modelo_id' => 2, 'matricula' => 'HK-5101', 'anio_fabricacion' => 2021, 'estado' => 'activo'],
            ['modelo_id' => 3, 'matricula' => 'HK-5200', 'anio_fabricacion' => 2019, 'estado' => 'activo'],
            ['modelo_id' => 3, 'matricula' => 'HK-5201', 'anio_fabricacion' => 2020, 'estado' => 'activo'],
            ['modelo_id' => 4, 'matricula' => 'HK-5300', 'anio_fabricacion' => 2017, 'estado' => 'activo'],
            ['modelo_id' => 4, 'matricula' => 'HK-5301', 'anio_fabricacion' => 2018, 'estado' => 'activo'],
        ];

        $timestamp = Carbon::now();

        foreach ($aeronaves as &$aeronave) {
            $aeronave['created_at'] = $timestamp;
            $aeronave['updated_at'] = $timestamp;
        }

        DB::table('aeronaves')->insert($aeronaves);

        $this->command->info('✅ Aeronaves creadas: ' . count($aeronaves));
    }
}

