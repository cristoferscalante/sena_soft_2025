<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pagador extends Model
{
    use HasFactory;

    protected $table = 'pagadores';

    protected $fillable = [
        'nombre_completo',
        'tipo_documento',
        'numero_documento',
        'correo',
        'telefono',
    ];

    /**
     * Reservas realizadas por este pagador
     */
    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class, 'pagador_id');
    }
}

