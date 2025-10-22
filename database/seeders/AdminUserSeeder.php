<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::updateOrCreate(
            ['email' => 'admin@airguider.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Usuario administrador creado:');
        $this->command->info('   Email: admin@airguider.com');
        $this->command->info('   Password: admin123');
        $this->command->info('   Rol: admin');
        
        // Crear usuario normal de ejemplo
        User::updateOrCreate(
            ['email' => 'usuario@airguider.com'],
            [
                'name' => 'Usuario Demo',
                'password' => Hash::make('usuario123'),
                'role' => 'usuario',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('');
        $this->command->info('✅ Usuario normal creado:');
        $this->command->info('   Email: usuario@airguider.com');
        $this->command->info('   Password: usuario123');
        $this->command->info('   Rol: usuario');
    }
}

