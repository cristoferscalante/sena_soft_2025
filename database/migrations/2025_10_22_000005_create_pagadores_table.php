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
        Schema::create('pagadores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_completo', 200);
            $table->enum('tipo_documento', ['CC', 'CE', 'Pasaporte', 'TI']);
            $table->string('numero_documento', 50);
            $table->string('correo', 100);
            $table->string('telefono', 20);
            $table->timestamps();
            
            // Índices
            $table->index(['tipo_documento', 'numero_documento']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagadores');
    }
};

