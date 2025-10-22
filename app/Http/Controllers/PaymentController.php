<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use App\Services\BookingService;
use App\Services\TicketService;
use App\Services\ReceiptService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
        protected BookingService $bookingService,
        protected TicketService $ticketService,
        protected ReceiptService $receiptService
    ) {}

    /**
     * Mostrar página de pago
     */
    public function create(int $reserva): Response
    {
        $reservaData = $this->bookingService->obtenerResumenReserva($reserva);

        return Inertia::render('Payment/Simulate', [
            // incluir el id numérico de la reserva para que el frontend pueda enviarlo
            'reserva' => array_merge($reservaData, ['id' => $reserva]),
        ]);
    }

    /**
     * Procesar pago con tarjeta de crédito
     */
    public function processCredit(Request $request): RedirectResponse
    {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'numero_tarjeta' => 'required|string|min:13|max:19',
            'titular' => 'required|string|max:200',
            'fecha_expiracion' => 'required|string',
            'cvv' => 'required|string|min:3|max:4',
        ]);

        try {
            $resultado = $this->paymentService->procesarTarjetaCredito(
                $request->reserva_id,
                $request->only(['numero_tarjeta', 'titular', 'fecha_expiracion', 'cvv'])
            );

            if ($resultado['success']) {
                $warnings = [];

                // Generar tiquetes (no bloquear el flujo si falla la generación de PDF)
                try {
                    $this->ticketService->generarTiquetes($request->reserva_id, 'pdf');
                } catch (\Exception $e) {
                    logger()->error('Error generando tiquetes tras pago', ['exception' => $e, 'reserva_id' => $request->reserva_id]);
                    $warnings[] = 'tiquetes';
                }

                // Generar recibo de pago (no bloquear el flujo si falla la generación de PDF)
                try {
                    $this->receiptService->generarReciboPDF($resultado['pago_id']);
                } catch (\Exception $e) {
                    logger()->error('Error generando recibo tras pago', ['exception' => $e, 'pago_id' => $resultado['pago_id']]);
                    $warnings[] = 'recibo';
                }

                // Obtener reserva y pago para la página de agradecimiento
                $reserva = $this->bookingService->obtenerResumenReserva($request->reserva_id);

                $redirect = redirect()->route('booking.thankyou', ['reserva_id' => $request->reserva_id])
                    ->with('success', $resultado['mensaje']);

                if (!empty($warnings)) {
                    $redirect = $redirect->with('warning', 'La generación de documentos (tiquetes/recibo) tuvo problemas. Se creó el pago correctamente.');
                }

                return $redirect;
            } else {
                return back()->withErrors(['error' => $resultado['mensaje']])->withInput();
            }
        } catch (\Exception $e) {
            logger()->error('Error procesando pago por tarjeta de crédito', ['exception' => $e]);
            return back()->withErrors(['error' => 'Ocurrió un error al procesar el pago. Por favor intenta nuevamente o contacta soporte.'])->withInput();
        }
    }

    /**
     * Procesar pago con tarjeta de débito
     */
    public function processDebit(Request $request): RedirectResponse
    {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'numero_tarjeta' => 'required|string|min:13|max:19',
            'titular' => 'required|string|max:200',
            'fecha_expiracion' => 'required|string',
            'cvv' => 'required|string|min:3|max:4',
        ]);

        try {
            $resultado = $this->paymentService->procesarTarjetaDebito(
                $request->reserva_id,
                $request->only(['numero_tarjeta', 'titular', 'fecha_expiracion', 'cvv'])
            );

            if ($resultado['success']) {
                $this->ticketService->generarTiquetes($request->reserva_id, 'pdf');
                
                // Generar recibo de pago
                $this->receiptService->generarReciboPDF($resultado['pago_id']);

                return redirect()->route('booking.thankyou', ['reserva_id' => $request->reserva_id])
                    ->with('success', $resultado['mensaje']);
            } else {
                return back()->withErrors(['error' => $resultado['mensaje']])->withInput();
            }
        } catch (\Exception $e) {
            logger()->error('Error procesando pago por tarjeta de débito', ['exception' => $e]);
            return back()->withErrors(['error' => 'Ocurrió un error al procesar el pago. Por favor intenta nuevamente o contacta soporte.'])->withInput();
        }
    }

    /**
     * Procesar pago con PSE
     */
    public function processPSE(Request $request): RedirectResponse
    {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'banco' => 'required|string',
            'tipo_cuenta' => 'required|in:ahorros,corriente',
            'tipo_persona' => 'required|in:natural,juridica',
        ]);

        try {
            $resultado = $this->paymentService->procesarPSE(
                $request->reserva_id,
                $request->only(['banco', 'tipo_cuenta', 'tipo_persona'])
            );

            if ($resultado['success']) {
                $this->ticketService->generarTiquetes($request->reserva_id, 'pdf');
                
                // Generar recibo de pago
                $this->receiptService->generarReciboPDF($resultado['pago_id']);

                return redirect()->route('booking.thankyou', ['reserva_id' => $request->reserva_id])
                    ->with('success', $resultado['mensaje']);
            } else {
                return back()->withErrors(['error' => $resultado['mensaje']])->withInput();
            }
        } catch (\Exception $e) {
            logger()->error('Error procesando pago PSE', ['exception' => $e]);
            return back()->withErrors(['error' => 'Ocurrió un error al procesar el pago. Por favor intenta nuevamente o contacta soporte.'])->withInput();
        }
    }

    /**
     * Mostrar página de agradecimiento
     */
    public function thankYou(int $reserva_id)
    {
        $reserva = $this->bookingService->obtenerResumenReserva($reserva_id);
        $reservaModel = \App\Models\Reserva::findOrFail($reserva_id);
        $pago = $reservaModel->pago;

        return inertia('Booking/ThankYou', [
            'reserva' => $reserva,
            'pago' => $pago,
        ]);
    }
}
