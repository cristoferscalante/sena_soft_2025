<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vuelo extends Model
{
    use HasFactory;

    protected $table = 'vuelos';

    protected $fillable = [
        'codigo_vuelo',
        'origen_ciudad_id',
        'destino_ciudad_id',
        'aeronave_id',
        'fecha_salida',
        'hora_salida',
        'fecha_llegada',
        'hora_llegada',
        'precio_base',
        'capacidad_total',
        'asientos_disponibles',
        'estado',
    ];

    protected $casts = [
        'fecha_salida' => 'date',
        'fecha_llegada' => 'date',
        'precio_base' => 'decimal:2',
        'capacidad_total' => 'integer',
        'asientos_disponibles' => 'integer',
    ];

    /**
     * Ciudad origen
     */
    public function ciudadOrigen(): BelongsTo
    {
        return $this->belongsTo(Ciudad::class, 'origen_ciudad_id');
    }

    /**
     * Ciudad destino
     */
    public function ciudadDestino(): BelongsTo
    {
        return $this->belongsTo(Ciudad::class, 'destino_ciudad_id');
    }

    /**
     * Aeronave del vuelo
     */
    public function aeronave(): BelongsTo
    {
        return $this->belongsTo(Aeronave::class, 'aeronave_id');
    }

    /**
     * Asientos del vuelo
     */
    public function asientos(): HasMany
    {
        return $this->hasMany(Asiento::class, 'vuelo_id');
    }

    /**
     * Reservas de este vuelo
     */
    public function reservas(): BelongsToMany
    {
        return $this->belongsToMany(Reserva::class, 'reservas_vuelos', 'vuelo_id', 'reserva_id')
                    ->withPivot('tipo_viaje')
                    ->withTimestamps();
    }

    /**
     * Tiquetes generados para este vuelo
     */
    public function tiquetes(): HasMany
    {
        return $this->hasMany(Tiquete::class, 'vuelo_id');
    }

    /**
     * Scope para vuelos disponibles
     */
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'programado')
                    ->where('asientos_disponibles', '>', 0)
                    ->where('fecha_salida', '>=', now()->toDateString());
    }

    /**
     * Scope para buscar vuelos
     */
    public function scopeBuscar($query, $origenId, $destinoId, $fecha)
    {
        return $query->where('origen_ciudad_id', $origenId)
                    ->where('destino_ciudad_id', $destinoId)
                    ->whereDate('fecha_salida', $fecha);
    }
}

