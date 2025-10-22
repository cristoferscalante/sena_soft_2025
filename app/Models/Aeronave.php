<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Aeronave extends Model
{
    use HasFactory;

    protected $table = 'aeronaves';

    protected $fillable = [
        'modelo_id',
        'matricula',
        'anio_fabricacion',
        'estado',
    ];

    protected $casts = [
        'anio_fabricacion' => 'integer',
    ];

    /**
     * Modelo de aeronave
     */
    public function modelo(): BelongsTo
    {
        return $this->belongsTo(ModeloAeronave::class, 'modelo_id');
    }

    /**
     * Vuelos operados por esta aeronave
     */
    public function vuelos(): HasMany
    {
        return $this->hasMany(Vuelo::class, 'aeronave_id');
    }
}

