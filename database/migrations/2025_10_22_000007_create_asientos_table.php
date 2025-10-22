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
        Schema::create('asientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vuelo_id')->constrained('vuelos')->onDelete('cascade');
            $table->string('numero', 10);
            $table->enum('clase', ['economica', 'ejecutiva', 'primera'])->default('economica');
            $table->enum('estado', ['disponible', 'reservado', 'emitido', 'bloqueado'])->default('disponible');
            $table->unsignedInteger('version')->default(0); // Para optimistic locking
            $table->unsignedBigInteger('reserva_id')->nullable(); // Sin foreign key constraint por ahora
            $table->timestamp('reservado_at')->nullable();
            $table->timestamps();
            
            // Restricción única: un vuelo no puede tener dos asientos con el mismo número
            $table->unique(['vuelo_id', 'numero']);
            
            // Índices
            $table->index(['vuelo_id', 'estado']);
            $table->index('reserva_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asientos');
    }
};

