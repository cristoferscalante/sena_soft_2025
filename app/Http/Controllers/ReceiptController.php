<?php

namespace App\Http\Controllers;

use App\Services\ReceiptService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReceiptController extends Controller
{
    public function __construct(
        protected ReceiptService $receiptService
    ) {}

    /**
     * Descargar recibo por referencia de pago
     */
    public function download(string $referencia): Response
    {
        try {
            $recibo = $this->receiptService->descargarRecibo($referencia);

            return response($recibo['contenido'], 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $recibo['nombre_archivo'] . '"',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ]);
        } catch (\Exception $e) {
            abort(404, 'Recibo no encontrado: ' . $e->getMessage());
        }
    }

    /**
     * Ver recibo en el navegador
     */
    public function view(string $referencia): Response
    {
        try {
            $recibo = $this->receiptService->descargarRecibo($referencia);

            return response($recibo['contenido'], 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $recibo['nombre_archivo'] . '"',
            ]);
        } catch (\Exception $e) {
            abort(404, 'Recibo no encontrado: ' . $e->getMessage());
        }
    }

    /**
     * Obtener información del recibo
     */
    public function info(string $referencia)
    {
        try {
            $info = $this->receiptService->obtenerInfoRecibo($referencia);
            
            return response()->json([
                'success' => true,
                'data' => $info,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Recibo no encontrado: ' . $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Listar recibos de una reserva
     */
    public function listByReservation(string $codigoReserva)
    {
        try {
            $recibos = $this->receiptService->obtenerRecibosReserva($codigoReserva);
            
            return response()->json([
                'success' => true,
                'data' => $recibos,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reserva no encontrada: ' . $e->getMessage(),
            ], 404);
        }
    }
}