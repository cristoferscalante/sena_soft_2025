<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Añade foreign keys después de que todas las tablas estén creadas
     */
    public function up(): void
    {
        Schema::table('asientos', function (Blueprint $table) {
            $table->foreign('reserva_id')
                  ->references('id')
                  ->on('reservas')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asientos', function (Blueprint $table) {
            $table->dropForeign(['reserva_id']);
        });
    }
};

