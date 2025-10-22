<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('aeronaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('modelo_id')->constrained('modelos_aeronave')->onDelete('restrict');
            $table->string('matricula', 20)->unique();
            $table->unsignedInteger('anio_fabricacion')->nullable();
            $table->enum('estado', ['activo', 'mantenimiento', 'fuera_servicio'])->default('activo');
            $table->timestamps();
            
            // Índices
            $table->index('modelo_id');
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aeronaves');
    }
};

