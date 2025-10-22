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
        Schema::create('tiquetes', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_tiquete', 16)->unique();
            $table->foreignId('reserva_id')->constrained('reservas')->onDelete('cascade');
            $table->foreignId('pasajero_id')->constrained('pasajeros')->onDelete('cascade');
            $table->foreignId('vuelo_id')->constrained('vuelos')->onDelete('restrict');
            $table->foreignId('asiento_id')->constrained('asientos')->onDelete('restrict');
            $table->enum('formato', ['pdf', 'json'])->default('pdf');
            $table->text('url_archivo')->nullable(); // URL del PDF en storage
            $table->json('contenido_json')->nullable(); // Contenido estructurado del tiquete
            $table->timestamps();
            
            // Índices
            $table->index('codigo_tiquete');
            $table->index('reserva_id');
            $table->index('pasajero_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiquetes');
    }
};

