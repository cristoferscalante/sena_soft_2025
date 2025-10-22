<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vuelo;
use App\Models\Ciudad;
use App\Models\Aeronave;
use App\Services\SeatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class VueloAdminController extends Controller
{
    public function __construct(
        protected SeatService $seatService
    ) {}

    /**
     * Listar vuelos
     */
    public function index()
    {
        $vuelos = Vuelo::with(['ciudadOrigen', 'ciudadDestino', 'aeronave.modelo'])
            ->orderBy('fecha_salida', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Vuelos/Index', [
            'vuelos' => $vuelos,
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        $ciudades = Ciudad::orderBy('nombre')->get();
        $aeronaves = Aeronave::with('modelo')->where('estado', 'activo')->get();

        return Inertia::render('Admin/Vuelos/Create', [
            'ciudades' => $ciudades,
            'aeronaves' => $aeronaves,
        ]);
    }

    /**
     * Guardar nuevo vuelo
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_vuelo' => 'required|string|max:10',
            'origen_ciudad_id' => 'required|exists:ciudades,id|different:destino_ciudad_id',
            'destino_ciudad_id' => 'required|exists:ciudades,id',
            'aeronave_id' => 'required|exists:aeronaves,id',
            'fecha_salida' => 'required|date',
            'hora_salida' => 'required',
            'fecha_llegada' => 'required|date|after_or_equal:fecha_salida',
            'hora_llegada' => 'required',
            'precio_base' => 'required|numeric|min:0',
        ]);

        // Obtener capacidad del modelo de aeronave
        $aeronave = Aeronave::with('modelo')->find($request->aeronave_id);

        $vuelo = Vuelo::create([
            ...$validated,
            'capacidad_total' => $aeronave->modelo->capacidad_total,
            'asientos_disponibles' => $aeronave->modelo->capacidad_total,
            'estado' => 'programado',
        ]);

        // Generar asientos automáticamente
        $this->seatService->generarAsientosParaVuelo($vuelo->id);

        return redirect()->route('admin.vuelos.index')
            ->with('success', 'Vuelo creado exitosamente');
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(int $id)
    {
        $vuelo = Vuelo::with(['ciudadOrigen', 'ciudadDestino', 'aeronave'])->findOrFail($id);
        $ciudades = Ciudad::orderBy('nombre')->get();
        $aeronaves = Aeronave::with('modelo')->where('estado', 'activo')->get();

        return Inertia::render('Admin/Vuelos/Edit', [
            'vuelo' => $vuelo,
            'ciudades' => $ciudades,
            'aeronaves' => $aeronaves,
        ]);
    }

    /**
     * Actualizar vuelo
     */
    public function update(Request $request, int $id)
    {
        $vuelo = Vuelo::findOrFail($id);

        $validated = $request->validate([
            'codigo_vuelo' => 'required|string|max:10',
            'origen_ciudad_id' => 'required|exists:ciudades,id|different:destino_ciudad_id',
            'destino_ciudad_id' => 'required|exists:ciudades,id',
            'fecha_salida' => 'required|date',
            'hora_salida' => 'required',
            'fecha_llegada' => 'required|date|after_or_equal:fecha_salida',
            'hora_llegada' => 'required',
            'precio_base' => 'required|numeric|min:0',
            'estado' => 'required|in:programado,en_vuelo,completado,cancelado',
        ]);

        Log::info('Datos validados para actualización de vuelo:', $validated);

        $vuelo->update($validated);

        Log::info('Vuelo actualizado:', $vuelo->toArray());

        return redirect()->route('admin.vuelos.index')
            ->with('success', 'Vuelo actualizado exitosamente');
    }    /**
     * Eliminar vuelo
     */
    public function destroy(int $id)
    {
        $vuelo = Vuelo::findOrFail($id);

        // Solo permitir eliminar si no tiene reservas confirmadas
        if ($vuelo->asientos()->where('estado', 'emitido')->exists()) {
            return back()->withErrors([
                'error' => 'No se puede eliminar un vuelo con tiquetes emitidos'
            ]);
        }

        $vuelo->delete();

        return redirect()->route('admin.vuelos.index')
            ->with('success', 'Vuelo eliminado exitosamente');
    }
}
