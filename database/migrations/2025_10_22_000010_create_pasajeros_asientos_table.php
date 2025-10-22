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
        Schema::create('pasajeros_asientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pasajero_id')->constrained('pasajeros')->onDelete('cascade');
            $table->foreignId('asiento_id')->constrained('asientos')->onDelete('cascade');
            $table->timestamps();
            
            // Restricciones únicas
            $table->unique(['pasajero_id', 'asiento_id']);
            $table->unique('asiento_id'); // Un asiento solo puede estar asignado a un pasajero
            
            // Índices
            $table->index('pasajero_id');
            $table->index('asiento_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pasajeros_asientos');
    }
};

