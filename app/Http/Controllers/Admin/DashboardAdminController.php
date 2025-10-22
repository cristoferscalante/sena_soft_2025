<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vuelo;
use App\Models\Reserva;
use App\Models\Ciudad;
use App\Models\Asiento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardAdminController extends Controller
{
    /**
     * Mostrar dashboard de admin
     */
    public function index()
    {
        $stats = [
            'total_vuelos' => Vuelo::count(),
            'vuelos_hoy' => Vuelo::whereDate('fecha_salida', today())->count(),
            'total_reservas' => Reserva::count(),
            'reservas_confirmadas' => Reserva::where('estado', 'confirmada')->count(),
            'total_ciudades' => Ciudad::count(),
            'asientos_disponibles' => Asiento::where('estado', 'disponible')->count(),
        ];

        $reservasRecientes = Reserva::with(['pagador', 'vuelos'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $vuelosProximos = Vuelo::with(['ciudadOrigen', 'ciudadDestino'])
            ->where('fecha_salida', '>=', today())
            ->orderBy('fecha_salida')
            ->orderBy('hora_salida')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'reservasRecientes' => $reservasRecientes,
            'vuelosProximos' => $vuelosProximos,
        ]);
    }
}
