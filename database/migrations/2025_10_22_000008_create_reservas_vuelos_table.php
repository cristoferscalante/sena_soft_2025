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
        Schema::create('reservas_vuelos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reserva_id')->constrained('reservas')->onDelete('cascade');
            $table->foreignId('vuelo_id')->constrained('vuelos')->onDelete('restrict');
            $table->enum('tipo_viaje', ['ida', 'regreso'])->nullable();
            $table->timestamps();
            
            // Restricción única: una reserva no puede tener el mismo vuelo duplicado
            $table->unique(['reserva_id', 'vuelo_id']);
            
            // Índice
            $table->index(['reserva_id', 'vuelo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas_vuelos');
    }
};

