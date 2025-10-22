<?php

namespace App\Http\Controllers;

use App\Services\SeatService;
use App\Services\FlightService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SeatController extends Controller
{
    public function __construct(
        protected SeatService $seatService,
        protected FlightService $flightService
    ) {}

    /**
     * Mostrar mapa de asientos para selección
     */
    public function index(Request $request): Response
    {
        $vuelosIds = $request->input('vuelos', []);
        
        if (empty($vuelosIds)) {
            return back()->withErrors(['error' => 'Debe seleccionar al menos un vuelo']);
        }

        $mapasAsientos = [];
        foreach ($vuelosIds as $vueloId) {
            $mapasAsientos[] = $this->seatService->obtenerMapaAsientos($vueloId);
        }

        return Inertia::render('Seats/Select', [
            'mapas_asientos' => $mapasAsientos,
            'vuelos_ids' => $vuelosIds,
        ]);
    }

    /**
     * Reservar asientos seleccionados (sin crear reserva aún)
     */
    public function reserve(Request $request): RedirectResponse
    {
        $request->validate([
            'asientos' => 'required|array|min:1|max:5',
            'asientos.*' => 'required|exists:asientos,id',
            'vuelos' => 'required|array|min:1',
        ]);

        try {
            // Guardar selección en sesión (no se reserva aún en BD)
            $request->session()->put('asientos_seleccionados', $request->asientos);
            $request->session()->put('vuelos_seleccionados', $request->vuelos);

            return redirect()->route('booking.create')
                ->with('success', 'Asientos seleccionados. Complete los datos de los pasajeros.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al seleccionar asientos: ' . $e->getMessage()]);
        }
    }

    /**
     * Verificar disponibilidad de asientos (AJAX)
     */
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'asientos' => 'required|array',
            'asientos.*' => 'required|exists:asientos,id',
        ]);

        $disponibilidad = $this->seatService->verificarDisponibilidad($request->asientos);

        return response()->json([
            'disponibilidad' => $disponibilidad,
        ]);
    }
}
