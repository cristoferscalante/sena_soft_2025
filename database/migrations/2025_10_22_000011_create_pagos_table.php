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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reserva_id')->constrained('reservas')->onDelete('cascade');
            $table->enum('metodo_pago', ['tarjeta_credito', 'tarjeta_debito', 'pse']);
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado', 'anulado'])->default('pendiente');
            $table->string('referencia', 50)->unique()->nullable();
            $table->decimal('monto', 10, 2);
            $table->json('datos_pago_json')->nullable(); // Datos adicionales del pago
            $table->timestamp('fecha_pago')->useCurrent();
            $table->timestamps();
            
            // Índices
            $table->index('reserva_id');
            $table->index('estado');
            $table->index('referencia');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};

