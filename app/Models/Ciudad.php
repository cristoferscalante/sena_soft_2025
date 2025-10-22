<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ciudad extends Model
{
    use HasFactory;

    protected $table = 'ciudades';

    protected $fillable = [
        'nombre',
        'codigo_iata',
        'pais',
    ];

    /**
     * Vuelos que salen de esta ciudad
     */
    public function vuelosOrigen(): HasMany
    {
        return $this->hasMany(Vuelo::class, 'origen_ciudad_id');
    }

    /**
     * Vuelos que llegan a esta ciudad
     */
    public function vuelosDestino(): HasMany
    {
        return $this->hasMany(Vuelo::class, 'destino_ciudad_id');
    }
}

