<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // Obtener reservas del usuario (basadas en el email del pagador)
        $reservas = \App\Models\Reserva::with(['vuelos.ciudadOrigen', 'vuelos.ciudadDestino', 'pago', 'pasajeros', 'tiquetes'])
            ->whereHas('pagador', function($query) use ($user) {
                $query->where('correo', $user->email);
            })
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($reserva) {
                return [
                    'id' => $reserva->id,
                    'codigo' => $reserva->codigo_unico,
                    'estado' => $reserva->estado,
                    'fecha_reserva' => $reserva->created_at->format('d/m/Y'),
                    'total' => $reserva->total,
                    'cantidad_pasajeros' => $reserva->cantidad_adultos + $reserva->cantidad_infantes,
                    'vuelos' => $reserva->vuelos->map(function($vuelo) {
                        return [
                            'codigo' => $vuelo->codigo,
                            'origen' => $vuelo->ciudadOrigen->nombre . ' (' . $vuelo->ciudadOrigen->codigo_iata . ')',
                            'destino' => $vuelo->ciudadDestino->nombre . ' (' . $vuelo->ciudadDestino->codigo_iata . ')',
                            'fecha_salida' => \Carbon\Carbon::parse($vuelo->fecha_salida)->format('d/m/Y'),
                        ];
                    }),
                    'pago' => $reserva->pago ? [
                        'metodo' => $reserva->pago->metodo_pago,
                        'estado' => $reserva->pago->estado,
                        'referencia' => $reserva->pago->referencia_pago,
                    ] : null,
                    'tiquetes_count' => $reserva->tiquetes->count(),
                ];
            });

        // Estadísticas del usuario
        $estadisticas = [
            'total_reservas' => \App\Models\Reserva::whereHas('pagador', function($query) use ($user) {
                $query->where('correo', $user->email);
            })->count(),
            'reservas_confirmadas' => \App\Models\Reserva::whereHas('pagador', function($query) use ($user) {
                $query->where('correo', $user->email);
            })->where('estado', 'confirmada')->count(),
            'total_gastado' => \App\Models\Reserva::whereHas('pagador', function($query) use ($user) {
                $query->where('correo', $user->email);
            })->where('estado', 'confirmada')->sum('total'),
        ];

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'reservas' => $reservas,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
