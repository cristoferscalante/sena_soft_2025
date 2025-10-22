<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Pasajero extends Model
{
    use HasFactory;

    protected $table = 'pasajeros';

    protected $fillable = [
        'reserva_id',
        'primer_apellido',
        'segundo_apellido',
        'nombres',
        'fecha_nacimiento',
        'genero',
        'tipo_documento',
        'numero_documento',
        'es_infante',
        'celular',
        'correo',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'es_infante' => 'boolean',
    ];

    /**
     * Reserva a la que pertenece el pasajero
     */
    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    /**
     * Asientos asignados al pasajero
     */
    public function asientos(): BelongsToMany
    {
        return $this->belongsToMany(Asiento::class, 'pasajeros_asientos', 'pasajero_id', 'asiento_id')
                    ->withTimestamps();
    }

    /**
     * Tiquetes del pasajero
     */
    public function tiquetes(): HasMany
    {
        return $this->hasMany(Tiquete::class, 'pasajero_id');
    }

    /**
     * Obtener edad del pasajero
     */
    public function getEdadAttribute(): int
    {
        return Carbon::parse($this->fecha_nacimiento)->age;
    }

    /**
     * Nombre completo del pasajero
     */
    public function getNombreCompletoAttribute(): string
    {
        return trim("{$this->primer_apellido} {$this->segundo_apellido} {$this->nombres}");
    }

    /**
     * Verificar si es infante (menor de 3 años)
     */
    public function esInfanteValido(): bool
    {
        return $this->es_infante ? $this->edad < 3 : true;
    }
}

