<?php

namespace App\Http\Controllers;

use App\Services\FlightService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlightController extends Controller
{
    public function __construct(
        protected FlightService $flightService
    ) {}

    /**
     * Mostrar página de búsqueda de vuelos
     */
    public function index(): Response
    {
        $ciudades = $this->flightService->obtenerTodasCiudades();

        return Inertia::render('Flights/Search', [
            'ciudades' => $ciudades,
        ]);
    }

    /**
     * Buscar vuelos disponibles
     */
    public function search(Request $request): Response
    {
        $request->validate([
            'origen_id' => 'required|exists:ciudades,id',
            'destino_id' => 'required|exists:ciudades,id|different:origen_id',
            'fecha_ida' => 'required|date|after_or_equal:today|before_or_equal:' . now()->addDays(60)->toDateString(),
            'fecha_regreso' => 'nullable|date|after_or_equal:fecha_ida|before_or_equal:' . now()->addDays(60)->toDateString(),
            'pasajeros' => 'required|integer|min:1|max:5',
            'infantes' => 'nullable|integer|min:0|max:2',
            'tipo_viaje' => 'required|in:ida,ida_regreso',
        ]);

        try {
            // Buscar vuelos de ida
            $vuelosIda = $this->flightService->buscarVuelos(
                $request->origen_id,
                $request->destino_id,
                $request->fecha_ida,
                $request->pasajeros
            );

            // Buscar vuelos de regreso si aplica
            $vuelosRegreso = [];
            if ($request->tipo_viaje === 'ida_regreso' && $request->fecha_regreso) {
                $vuelosRegreso = $this->flightService->buscarVuelos(
                    $request->destino_id, // Origen y destino invertidos
                    $request->origen_id,
                    $request->fecha_regreso,
                    $request->pasajeros
                );
            }

            return Inertia::render('Flights/Results', [
                'vuelos_ida' => $vuelosIda,
                'vuelos_regreso' => $vuelosRegreso,
                'busqueda' => $request->only(['origen_id', 'destino_id', 'fecha_ida', 'fecha_regreso', 'pasajeros', 'tipo_viaje']),
            ]);
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Obtener detalles de un vuelo
     */
    public function show(int $id): Response
    {
        $vuelo = $this->flightService->obtenerDetallesVuelo($id);

        if (!$vuelo) {
            abort(404, 'Vuelo no encontrado');
        }

        return Inertia::render('Flights/Show', [
            'vuelo' => $vuelo,
        ]);
    }

    /**
     * Autocompletar ciudades (AJAX)
     */
    public function autocompleteCiudades(Request $request)
    {
        $termino = $request->get('q', '');
        $ciudades = $this->flightService->buscarCiudades($termino);

        return response()->json($ciudades);
    }
}
