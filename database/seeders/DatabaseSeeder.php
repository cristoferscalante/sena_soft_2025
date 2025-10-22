<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🚀 Iniciando seeders...');
        
        $this->call([
            CiudadSeeder::class,
            ModeloAeronaveSeeder::class,
            AeronaveSeeder::class,
            VueloSeeder::class,
            AdminUserSeeder::class,
        ]);

        $this->command->info('');
        $this->command->info('✨ ¡Seeders completados exitosamente!');
        $this->command->info('');
        $this->command->info('📊 Resumen:');
        $this->command->info('   - 15 ciudades');
        $this->command->info('   - 4 modelos de aeronave');
        $this->command->info('   - 8 aeronaves');
        $this->command->info('   - ~960 vuelos (próximos 60 días)');
        $this->command->info('   - Miles de asientos disponibles');
        $this->command->info('');
    }
}
