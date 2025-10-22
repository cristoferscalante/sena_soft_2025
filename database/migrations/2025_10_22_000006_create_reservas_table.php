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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_unico', 8)->unique();
            $table->foreignId('pagador_id')->constrained('pagadores')->onDelete('restrict');
            $table->enum('estado', ['pendiente', 'pagada', 'confirmada', 'cancelada', 'expirada'])->default('pendiente');
            $table->decimal('total', 10, 2);
            $table->unsignedTinyInteger('cantidad_pasajeros');
            $table->boolean('terminos_aceptados')->default(false);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->timestamp('fecha_expiracion')->nullable();
            $table->timestamps();
            
            // Nota: Validación de cantidad_pasajeros se hará a nivel de aplicación
            
            // Índices
            $table->index('codigo_unico');
            $table->index('estado');
            $table->index('fecha_creacion');
            $table->index(['fecha_expiracion', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};

