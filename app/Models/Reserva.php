<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Reserva extends Model
{
    use HasFactory;

    protected $table = 'reservas';

    protected $fillable = [
        'codigo_unico',
        'pagador_id',
        'estado',
        'total',
        'cantidad_pasajeros',
        'terminos_aceptados',
        'fecha_creacion',
        'fecha_expiracion',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'cantidad_pasajeros' => 'integer',
        'terminos_aceptados' => 'boolean',
        'fecha_creacion' => 'datetime',
        'fecha_expiracion' => 'datetime',
    ];

    /**
     * Boot method para generar código único automáticamente
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($reserva) {
            if (empty($reserva->codigo_unico)) {
                $reserva->codigo_unico = strtoupper(Str::random(8));
            }
            if (empty($reserva->fecha_expiracion)) {
                $reserva->fecha_expiracion = now()->addMinutes(5);
            }
        });
    }

    /**
     * Pagador de la reserva
     */
    public function pagador(): BelongsTo
    {
        return $this->belongsTo(Pagador::class, 'pagador_id');
    }

    /**
     * Pasajeros de la reserva
     */
    public function pasajeros(): HasMany
    {
        return $this->hasMany(Pasajero::class, 'reserva_id');
    }

    /**
     * Vuelos de la reserva
     */
    public function vuelos(): BelongsToMany
    {
        return $this->belongsToMany(Vuelo::class, 'reservas_vuelos', 'reserva_id', 'vuelo_id')
                    ->withPivot('tipo_viaje')
                    ->withTimestamps();
    }

    /**
     * Asientos reservados
     */
    public function asientos(): HasMany
    {
        return $this->hasMany(Asiento::class, 'reserva_id');
    }

    /**
     * Pago de la reserva
     */
    public function pago(): HasOne
    {
        return $this->hasOne(Pago::class, 'reserva_id');
    }

    /**
     * Tiquetes de la reserva
     */
    public function tiquetes(): HasMany
    {
        return $this->hasMany(Tiquete::class, 'reserva_id');
    }

    /**
     * Scope para reservas activas (no expiradas)
     */
    public function scopeActivas($query)
    {
        return $query->where('estado', 'pendiente')
                    ->where('fecha_expiracion', '>', now());
    }

    /**
     * Scope para reservas expiradas
     */
    public function scopeExpiradas($query)
    {
        return $query->where('estado', 'pendiente')
                    ->where('fecha_expiracion', '<=', now());
    }

    /**
     * Verificar si la reserva está expirada
     */
    public function estaExpirada(): bool
    {
        return $this->estado === 'pendiente' && $this->fecha_expiracion <= now();
    }
}

