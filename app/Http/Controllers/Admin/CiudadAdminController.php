<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ciudad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CiudadAdminController extends Controller
{
    public function index()
    {
        $ciudades = Ciudad::withCount('vuelosOrigen', 'vuelosDestino')
            ->orderBy('nombre')
            ->paginate(20);

        return Inertia::render('Admin/Ciudades/Index', [
            'ciudades' => $ciudades,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Ciudades/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'codigo_iata' => 'required|string|size:3|unique:ciudades,codigo_iata',
            'pais' => 'required|string|max:100',
        ]);

        Ciudad::create($validated);

        return redirect()->route('admin.ciudades.index')
            ->with('success', 'Ciudad creada exitosamente');
    }

    public function edit(int $id)
    {
        $ciudad = Ciudad::findOrFail($id);

        return Inertia::render('Admin/Ciudades/Edit', [
            'ciudad' => $ciudad,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $ciudad = Ciudad::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'codigo_iata' => 'required|string|size:3|unique:ciudades,codigo_iata,' . $id,
            'pais' => 'required|string|max:100',
        ]);

        Log::info('Actualizando ciudad:', ['id' => $id, 'datos' => $validated]);

        $ciudad->update($validated);

        Log::info('Ciudad actualizada:', $ciudad->toArray());

        return redirect()->route('admin.ciudades.index')
            ->with('success', 'Ciudad actualizada exitosamente');
    }

    public function destroy(int $id)
    {
        $ciudad = Ciudad::findOrFail($id);

        if ($ciudad->vuelosOrigen()->exists() || $ciudad->vuelosDestino()->exists()) {
            return back()->withErrors([
                'error' => 'No se puede eliminar una ciudad con vuelos asociados'
            ]);
        }

        $ciudad->delete();

        return redirect()->route('admin.ciudades.index')
            ->with('success', 'Ciudad eliminada exitosamente');
    }
}
