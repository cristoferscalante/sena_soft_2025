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
    public function simularPago(int $reservaId, array $datosPago): array
    {
        $reserva = Reserva::findOrFail($reservaId);

        // Validar que la reserva esté pendiente
        if ($reserva->estado !== 'pendiente') {
            throw new \RuntimeException("La reserva no está en estado pendiente");
        }

        // Validar que no haya expirado
        if ($reserva->estaExpirada()) {
            throw new \RuntimeException("La reserva ha expirado");
        }

        // Simular procesamiento (80% aprobado, 20% rechazado)
        $esAprobado = (rand(1, 100) <= 80);

        return DB::transaction(function () use ($reserva, $datosPago, $esAprobado) {
            // Crear registro de pago
            $pago = Pago::create([
                'reserva_id' => $reserva->id,
                'metodo_pago' => $datosPago['metodo_pago'],
                'estado' => $esAprobado ? 'aprobado' : 'rechazado',
                'monto' => $reserva->total,
                'datos_pago_json' => $this->sanitizarDatosPago($datosPago),
            ]);

            if ($esAprobado) {
                // Actualizar estado de reserva
                $reserva->update(['estado' => 'pagada']);

                // Confirmar reserva (cambiar asientos a "emitido")
                $this->bookingService->confirmarReserva($reserva->id);

                return [
                    'success' => true,
                    'mensaje' => '¡Pago aprobado exitosamente!',
                    'referencia' => $pago->referencia,
                    'pago_id' => $pago->id,
                    'reserva_codigo' => $reserva->codigo_unico,
                ];
            } else {
                return [
                    'success' => false,
                    'mensaje' => 'El pago fue rechazado. Por favor, intente con otro método de pago.',
                    'referencia' => $pago->referencia,
                    'pago_id' => $pago->id,
                ];
            }
        });
    }

    /**
     * Procesar pago con tarjeta de crédito (simulado)
     */
    public function procesarTarjetaCredito(int $reservaId, array $datosTarjeta): array
    {
        // Validar datos de tarjeta
        $this->validarDatosTarjeta($datosTarjeta);

        return $this->simularPago($reservaId, [
            'metodo_pago' => 'tarjeta_credito',
            'numero_tarjeta' => substr($datosTarjeta['numero_tarjeta'], -4), // Solo últimos 4 dígitos
            'titular' => $datosTarjeta['titular'],
            'tipo_tarjeta' => $this->detectarTipoTarjeta($datosTarjeta['numero_tarjeta']),
        ]);
    }

    /**
     * Procesar pago con tarjeta de débito (simulado)
     */
    public function procesarTarjetaDebito(int $reservaId, array $datosTarjeta): array
    {
        $this->validarDatosTarjeta($datosTarjeta);

        return $this->simularPago($reservaId, [
            'metodo_pago' => 'tarjeta_debito',
            'numero_tarjeta' => substr($datosTarjeta['numero_tarjeta'], -4),
            'titular' => $datosTarjeta['titular'],
            'tipo_tarjeta' => $this->detectarTipoTarjeta($datosTarjeta['numero_tarjeta']),
        ]);
    }

    /**
     * Procesar pago con PSE (simulado)
     */
    public function procesarPSE(int $reservaId, array $datosPSE): array
    {
        // Validar datos PSE
        if (empty($datosPSE['banco']) || empty($datosPSE['tipo_cuenta']) || empty($datosPSE['tipo_persona'])) {
            throw new \InvalidArgumentException('Datos de PSE incompletos');
        }

        return $this->simularPago($reservaId, [
            'metodo_pago' => 'pse',
            'banco' => $datosPSE['banco'],
            'tipo_cuenta' => $datosPSE['tipo_cuenta'],
            'tipo_persona' => $datosPSE['tipo_persona'],
        ]);
    }

    /**
     * Validar datos de tarjeta
     */
    protected function validarDatosTarjeta(array $datosTarjeta): void
    {
        if (empty($datosTarjeta['numero_tarjeta'])) {
            throw new \InvalidArgumentException('Número de tarjeta requerido');
        }

        if (empty($datosTarjeta['titular'])) {
            throw new \InvalidArgumentException('Nombre del titular requerido');
        }

        if (empty($datosTarjeta['fecha_expiracion'])) {
            throw new \InvalidArgumentException('Fecha de expiración requerida');
        }

        if (empty($datosTarjeta['cvv'])) {
            throw new \InvalidArgumentException('CVV requerido');
        }

        // Validar formato de tarjeta (Luhn algorithm simplificado)
        $numeroTarjeta = preg_replace('/\s+/', '', $datosTarjeta['numero_tarjeta']);
        if (strlen($numeroTarjeta) < 13 || strlen($numeroTarjeta) > 19) {
            throw new \InvalidArgumentException('Número de tarjeta inválido');
        }
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
     * Sanitizar datos de pago (no guardar información sensible completa)
     */
    protected function sanitizarDatosPago(array $datosPago): array
    {
        $sanitizado = $datosPago;

        // Remover información sensible si existe
        if (isset($sanitizado['numero_tarjeta'])) {
            // Solo guardar últimos 4 dígitos
            $sanitizado['numero_tarjeta'] = '****' . substr($sanitizado['numero_tarjeta'], -4);
        }

        unset($sanitizado['cvv']);
        unset($sanitizado['password']);

        return $sanitizado;
    }

    /**
     * Obtener información de un pago
     */
    public function obtenerPago(int $pagoId): ?Pago
    {
        return Pago::with('reserva')->find($pagoId);
    }

    /**
     * Obtener historial de pagos de una reserva
     */
    public function obtenerHistorialPagos(int $reservaId): array
    {
        return Pago::where('reserva_id', $reservaId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pago) {
                return [
                    'id' => $pago->id,
                    'metodo_pago' => $pago->metodo_pago,
                    'estado' => $pago->estado,
                    'monto' => (float) $pago->monto,
                    'referencia' => $pago->referencia,
                    'fecha' => $pago->fecha_pago->format('d/m/Y H:i:s'),
                ];
            })
            ->toArray();
    }

    /**
     * Reintentar pago fallido
     */
    public function reintentarPago(int $pagoId, array $nuevosDatosPago): array
    {
        $pagoAnterior = Pago::findOrFail($pagoId);

        if ($pagoAnterior->estado !== 'rechazado') {
            throw new \RuntimeException('Solo se pueden reintentar pagos rechazados');
        }

        // Marcar pago anterior como anulado
        $pagoAnterior->update(['estado' => 'anulado']);

        // Intentar nuevo pago
        return $this->simularPago($pagoAnterior->reserva_id, $nuevosDatosPago);
    }
}

