<?php

namespace App\Http\Controllers;

use App\Services\BookingService;
use App\Services\FlightService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BookingController extends Controller
{
    public function __construct(
        protected BookingService $bookingService,
        protected FlightService $flightService
    ) {}

    /**
     * Mostrar formulario de pasajeros
     */
    public function create(Request $request): Response
    {
        $vuelosSeleccionados = $request->session()->get('vuelos_seleccionados', []);
        $asientosSeleccionados = $request->session()->get('asientos_seleccionados', []);

        if (empty($vuelosSeleccionados)) {
            return Inertia::render('Flights/Search')->with('error', 'Debe seleccionar al menos un vuelo');
        }

        // Obtener detalles de los vuelos
        $vuelosDetalles = [];
        foreach ($vuelosSeleccionados as $vueloId) {
            $vuelosDetalles[] = $this->flightService->obtenerDetallesVuelo($vueloId);
        }

        return Inertia::render('Booking/Passengers', [
            'vuelos' => $vuelosDetalles,
            'asientos' => $asientosSeleccionados,
            'cantidad_pasajeros' => count($asientosSeleccionados),
        ]);
    }

    /**
     * Crear reserva
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'pagador.nombre_completo' => 'required|string|max:200',
            'pagador.tipo_documento' => 'required|in:CC,CE,Pasaporte,TI',
            'pagador.numero_documento' => 'required|string|max:50',
            'pagador.correo' => 'required|email|max:100',
            'pagador.telefono' => 'required|string|max:20',
            'pasajeros' => 'required|array|min:1|max:5',
            'pasajeros.*.primer_apellido' => 'required|string|max:100',
            'pasajeros.*.segundo_apellido' => 'nullable|string|max:100',
            'pasajeros.*.nombres' => 'required|string|max:200',
            'pasajeros.*.fecha_nacimiento' => 'required|date|before:today',
            'pasajeros.*.genero' => 'required|in:M,F,Otro',
            'pasajeros.*.tipo_documento' => 'required|in:CC,CE,Pasaporte,TI,RC',
            'pasajeros.*.numero_documento' => 'required|string|max:50',
            'pasajeros.*.es_infante' => 'boolean',
            'pasajeros.*.celular' => 'required|string|max:20',
            'pasajeros.*.correo' => 'required|email|max:100',
            'vuelos' => 'required|array|min:1',
            'vuelos.*.vuelo_id' => 'required|exists:vuelos,id',
            'vuelos.*.tipo_viaje' => 'required|in:ida,regreso',
            'asientos' => 'required|array|min:1',
            'terminos_aceptados' => 'required|accepted',
        ]);

        try {
            // Validar datos de reserva
            $validacion = $this->bookingService->validarDatosReserva($validated);
            
            if (!$validacion['valido']) {
                return back()->withErrors($validacion['errores'])->withInput();
            }

            // Crear reserva
            $reserva = $this->bookingService->crearReserva($validated);

            // Limpiar sesión
            $request->session()->forget(['vuelos_seleccionados', 'asientos_seleccionados']);

            // Guardar reserva en sesión para el pago
            $request->session()->put('reserva_pendiente', $reserva->id);

            return redirect()->route('payment.create', ['reserva' => $reserva->id])
                ->with('success', 'Reserva creada exitosamente. Código: ' . $reserva->codigo_unico);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al crear la reserva: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Mostrar confirmación de reserva
     */
    public function show(string $codigo): Response
    {
        $reserva = $this->bookingService->obtenerReserva($codigo);

        if (!$reserva) {
            abort(404, 'Reserva no encontrada');
        }

        $resumen = $this->bookingService->obtenerResumenReserva($reserva->id);

        return Inertia::render('Booking/Confirmation', [
            'reserva' => $resumen,
        ]);
    }

    /**
     * Cancelar reserva
     */
    public function cancel(int $id): RedirectResponse
    {
        try {
            $this->bookingService->cancelarReserva($id);

            return redirect()->route('flights.index')
                ->with('success', 'Reserva cancelada exitosamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al cancelar la reserva: ' . $e->getMessage()]);
        }
    }
}
