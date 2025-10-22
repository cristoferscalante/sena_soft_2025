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
        Schema::create('vuelos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_vuelo', 10);
            $table->foreignId('origen_ciudad_id')->constrained('ciudades')->onDelete('restrict');
            $table->foreignId('destino_ciudad_id')->constrained('ciudades')->onDelete('restrict');
            $table->foreignId('aeronave_id')->constrained('aeronaves')->onDelete('restrict');
            $table->date('fecha_salida');
            $table->time('hora_salida');
            $table->date('fecha_llegada');
            $table->time('hora_llegada');
            $table->decimal('precio_base', 10, 2);
            $table->unsignedInteger('capacidad_total');
            $table->unsignedInteger('asientos_disponibles');
            $table->enum('estado', ['programado', 'en_vuelo', 'completado', 'cancelado'])->default('programado');
            $table->timestamps();
            
            // Nota: Validaciones se harán a nivel de aplicación
            
            // Índices
            $table->index(['origen_ciudad_id', 'destino_ciudad_id', 'fecha_salida']);
            $table->index('fecha_salida');
            $table->index('codigo_vuelo');
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vuelos');
    }
};

