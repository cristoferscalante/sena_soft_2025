<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tiquete extends Model
{
    use HasFactory;

    protected $table = 'tiquetes';

    protected $fillable = [
        'codigo_tiquete',
        'reserva_id',
        'pasajero_id',
        'vuelo_id',
        'asiento_id',
        'formato',
        'url_archivo',
        'contenido_json',
    ];

    protected $casts = [
        'contenido_json' => 'array',
    ];

    /**
     * Boot method para generar código de tiquete automáticamente
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tiquete) {
            if (empty($tiquete->codigo_tiquete)) {
                $reserva = Reserva::find($tiquete->reserva_id);
                $secuencial = Tiquete::where('reserva_id', $tiquete->reserva_id)->count() + 1;
                $tiquete->codigo_tiquete = 'TKT-' . $reserva->codigo_unico . '-' . str_pad($secuencial, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    /**
     * Reserva del tiquete
     */
    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    /**
     * Pasajero del tiquete
     */
    public function pasajero(): BelongsTo
    {
        return $this->belongsTo(Pasajero::class, 'pasajero_id');
    }

    /**
     * Vuelo del tiquete
     */
    public function vuelo(): BelongsTo
    {
        return $this->belongsTo(Vuelo::class, 'vuelo_id');
    }

    /**
     * Asiento del tiquete
     */
    public function asiento(): BelongsTo
    {
        return $this->belongsTo(Asiento::class, 'asiento_id');
    }

    /**
     * Scope para tiquetes en formato PDF
     */
    public function scopePdf($query)
    {
        return $query->where('formato', 'pdf');
    }

    /**
     * Scope para tiquetes en formato JSON
     */
    public function scopeJson($query)
    {
        return $query->where('formato', 'json');
    }
}

