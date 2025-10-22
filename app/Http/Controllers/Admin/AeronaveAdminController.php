<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Aeronave;
use App\Models\ModeloAeronave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AeronaveAdminController extends Controller
{
    public function index()
    {
        $aeronaves = Aeronave::with('modelo')
            ->withCount('vuelos')
            ->orderBy('matricula')
            ->paginate(20);

        return Inertia::render('Admin/Aeronaves/Index', [
            'aeronaves' => $aeronaves,
        ]);
    }

    public function create()
    {
        $modelos = ModeloAeronave::orderBy('nombre')->get();

        return Inertia::render('Admin/Aeronaves/Create', [
            'modelos' => $modelos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'modelo_id' => 'required|exists:modelos_aeronave,id',
            'matricula' => 'required|string|max:20|unique:aeronaves,matricula',
            'anio_fabricacion' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'estado' => 'required|in:activo,mantenimiento,fuera_servicio',
        ]);

        Aeronave::create($validated);

        return redirect()->route('admin.aeronaves.index')
            ->with('success', 'Aeronave creada exitosamente');
    }

    public function edit(int $id)
    {
        $aeronave = Aeronave::with('modelo')->findOrFail($id);
        $modelos = ModeloAeronave::orderBy('nombre')->get();

        return Inertia::render('Admin/Aeronaves/Edit', [
            'aeronave' => $aeronave,
            'modelos' => $modelos,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $aeronave = Aeronave::findOrFail($id);

        $validated = $request->validate([
            'modelo_id' => 'required|exists:modelos_aeronave,id',
            'matricula' => 'required|string|max:20|unique:aeronaves,matricula,' . $id,
            'anio_fabricacion' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'estado' => 'required|in:activo,mantenimiento,fuera_servicio',
        ]);

        Log::info('Actualizando aeronave:', ['id' => $id, 'datos' => $validated]);

        $aeronave->update($validated);

        Log::info('Aeronave actualizada:', $aeronave->toArray());

        return redirect()->route('admin.aeronaves.index')
            ->with('success', 'Aeronave actualizada exitosamente');
    }

    public function destroy(int $id)
    {
        $aeronave = Aeronave::findOrFail($id);

        if ($aeronave->vuelos()->exists()) {
            return back()->withErrors([
                'error' => 'No se puede eliminar una aeronave con vuelos asociados'
            ]);
        }

        $aeronave->delete();

        return redirect()->route('admin.aeronaves.index')
            ->with('success', 'Aeronave eliminada exitosamente');
    }
}
