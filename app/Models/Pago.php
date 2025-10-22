<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Pago extends Model
{
    use HasFactory;

    protected $table = 'pagos';

    protected $fillable = [
        'reserva_id',
        'metodo_pago',
        'estado',
        'referencia',
        'monto',
        'datos_pago_json',
        'fecha_pago',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'datos_pago_json' => 'array',
        'fecha_pago' => 'datetime',
    ];

    /**
     * Boot method para generar referencia automáticamente
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($pago) {
            if (empty($pago->referencia)) {
                $pago->referencia = 'PAY-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    /**
     * Reserva asociada al pago
     */
    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    /**
     * Verificar si el pago fue aprobado
     */
    public function estaAprobado(): bool
    {
        return $this->estado === 'aprobado';
    }

    /**
     * Verificar si el pago fue rechazado
     */
    public function estaRechazado(): bool
    {
        return $this->estado === 'rechazado';
    }

    /**
     * Scope para pagos aprobados
     */
    public function scopeAprobados($query)
    {
        return $query->where('estado', 'aprobado');
    }

    /**
     * Scope para pagos rechazados
     */
    public function scopeRechazados($query)
    {
        return $query->where('estado', 'rechazado');
    }
}

