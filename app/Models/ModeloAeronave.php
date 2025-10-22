<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ModeloAeronave extends Model
{
    use HasFactory;

    protected $table = 'modelos_aeronave';

    protected $fillable = [
        'nombre',
        'fabricante',
        'capacidad_total',
        'filas',
        'asientos_por_fila',
    ];

    protected $casts = [
        'capacidad_total' => 'integer',
        'filas' => 'integer',
        'asientos_por_fila' => 'integer',
    ];

    /**
     * Aeronaves de este modelo
     */
    public function aeronaves(): HasMany
    {
        return $this->hasMany(Aeronave::class, 'modelo_id');
    }
}

