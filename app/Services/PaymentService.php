<?php

namespace App\Services;

use App\Models\Pago;
use App\Models\Reserva;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Simular procesamiento de pago
     * 80% de probabilidad de éxito, 20% de rechazo
     */
    private function simularPago(int $reservaId, array $datosPago): array
    {
        $reserva = Reserva::findOrFail($reservaId);
        
        // Simular pago con 80% de éxito
        $esAprobado = (rand(1, 100) <= 80);
        
        return DB::transaction(function () use ($reserva, $datosPago, $esAprobado) {
            // Crear pago
            $pago = Pago::create([
                'reserva_id' => $reserva->id,
                'metodo_pago' => $datosPago['metodo_pago'],
                'estado' => $esAprobado ? 'aprobado' : 'rechazado',
                'monto' => $reserva->total,
                'datos_pago_json' => [
                    'ultimos_digitos' => substr(preg_replace('/\D/', '', $datosPago['numero_tarjeta'] ?? ''), -4),
                    'tipo_tarjeta' => $this->detectarTipoTarjeta($datosPago['numero_tarjeta'] ?? ''),
                ],
                'fecha_pago' => now(),
            ]);

            if ($esAprobado) {
                $reserva->update(['estado' => 'pagada']);
                $this->bookingService->confirmarReserva($reserva->id);
            }

            return [
                'success' => $esAprobado,
                'mensaje' => $esAprobado ? '¡Pago aprobado exitosamente!' : 'Pago rechazado. Por favor, intente con otro método de pago.',
                'referencia' => $pago->referencia,
                'pago_id' => $pago->id,
            ];
        });
    }

    /**
     * Procesar pago con tarjeta de crédito (simulado)
     */
    public function procesarTarjetaCredito(int $reservaId, array $datosTarjeta): array
    {
        if (!$this->validarTarjeta($datosTarjeta)) {
            return [
                'success' => false,
                'mensaje' => 'Datos de tarjeta inválidos'
            ];
        }

        return $this->simularPago($reservaId, [
            'metodo_pago' => 'tarjeta_credito',
            'numero_tarjeta' => $datosTarjeta['numero_tarjeta']
        ]);
    }

    /**
     * Procesar pago con tarjeta de débito (simulado)
     */
    public function procesarTarjetaDebito(int $reservaId, array $datosTarjeta): array
    {
        if (!$this->validarTarjeta($datosTarjeta)) {
            return [
                'success' => false,
                'mensaje' => 'Datos de tarjeta inválidos'
            ];
        }

        return $this->simularPago($reservaId, [
            'metodo_pago' => 'tarjeta_debito',
            'numero_tarjeta' => $datosTarjeta['numero_tarjeta']
        ]);
    }

    /**
     * Procesar pago con PSE (simulado)
     */
    public function procesarPSE(int $reservaId, array $datosPSE): array
    {
        return $this->simularPago($reservaId, [
            'metodo_pago' => 'pse',
            'banco' => $datosPSE['banco'] ?? 'desconocido'
        ]);
    }

    /**
     * Validar datos básicos de tarjeta
     */
    private function validarTarjeta(array $datosTarjeta): bool
    {
        // Validación mínima: número entre 13-19 dígitos
        $numero = preg_replace('/\D/', '', $datosTarjeta['numero_tarjeta'] ?? '');
        return strlen($numero) >= 13 && strlen($numero) <= 19;
    }

    /**
     * Detectar tipo de tarjeta por número
     */
    protected function detectarTipoTarjeta(string $numeroTarjeta): string
    {
        $numeroTarjeta = preg_replace('/\s+/', '', $numeroTarjeta);

        if (preg_match('/^4/', $numeroTarjeta)) {
            return 'Visa';
        } elseif (preg_match('/^5[1-5]/', $numeroTarjeta)) {
            return 'Mastercard';
        } elseif (preg_match('/^3[47]/', $numeroTarjeta)) {
            return 'American Express';
        } else {
            return 'Desconocida';
        }
    }

    /**
     * Obtener información de un pago
     */
    public function obtenerPago(int $pagoId): ?Pago
    {
        return Pago::with('reserva')->find($pagoId);
    }
}

