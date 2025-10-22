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
        Schema::create('modelos_aeronave', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('fabricante', 100);
            $table->unsignedInteger('capacidad_total');
            $table->unsignedInteger('filas');
            $table->unsignedInteger('asientos_por_fila');
            $table->timestamps();
            
            // Nota: Validación de capacidad se hará a nivel de aplicación
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modelos_aeronave');
    }
};

