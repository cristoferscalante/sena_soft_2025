<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asiento extends Model
{
    use HasFactory;

    protected $table = 'asientos';

    protected $fillable = [
        'vuelo_id',
        'numero',
        'clase',
        'estado',
        'version',
        'reserva_id',
        'reservado_at',
    ];

    protected $casts = [
        'version' => 'integer',
        'reservado_at' => 'datetime',
    ];

    /**
     * Vuelo al que pertenece el asiento
     */
    public function vuelo(): BelongsTo
    {
        return $this->belongsTo(Vuelo::class, 'vuelo_id');
    }

    /**
     * Reserva asociada
     */
    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    /**
     * Pasajeros asignados a este asiento
     */
    public function pasajeros(): BelongsToMany
    {
        return $this->belongsToMany(Pasajero::class, 'pasajeros_asientos', 'asiento_id', 'pasajero_id')
                    ->withTimestamps();
    }

    /**
     * Tiquetes de este asiento
     */
    public function tiquetes(): HasMany
    {
        return $this->hasMany(Tiquete::class, 'asiento_id');
    }

    /**
     * Scope para asientos disponibles
     */
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'disponible');
    }

    /**
     * Scope para asientos de un vuelo
     */
    public function scopeDelVuelo($query, $vueloId)
    {
        return $query->where('vuelo_id', $vueloId);
    }
}

