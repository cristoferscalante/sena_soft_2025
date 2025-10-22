<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservaAdminController extends Controller
{
    /**
     * Listar todas las reservas
     */
    public function index()
    {
        $reservas = Reserva::with(['pagador', 'pasajeros', 'vuelos', 'pago'])
            ->withCount('pasajeros')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Reservas/Index', [
            'reservas' => $reservas,
        ]);
    }

    /**
     * Ver detalles de una reserva
     */
    public function show(int $id)
    {
        $reserva = Reserva::with([
            'pagador',
            'pasajeros.asientos.vuelo',
            'vuelos.ciudadOrigen',
            'vuelos.ciudadDestino',
            'pago',
            'tiquetes',
        ])->findOrFail($id);

        return Inertia::render('Admin/Reservas/Show', [
            'reserva' => $reserva,
        ]);
    }
}
