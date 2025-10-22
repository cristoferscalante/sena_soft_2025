<?php

namespace App\Http\Controllers;

use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService
    ) {}

    /**
     * Descargar tiquete
     */
    public function download(int $id): Response
    {
        try {
            $archivo = $this->ticketService->descargarTiquete($id);

            if ($archivo['tipo'] === 'pdf') {
                return response($archivo['contenido'])
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename="' . $archivo['nombre_archivo'] . '"');
            } else {
                return response($archivo['contenido'])
                    ->header('Content-Type', 'application/json')
                    ->header('Content-Disposition', 'attachment; filename="' . $archivo['nombre_archivo'] . '"');
            }
        } catch (\Exception $e) {
            abort(404, 'Tiquete no encontrado');
        }
    }

    /**
     * Obtener tiquetes de una reserva (AJAX)
     */
    public function getTiquetesReserva(string $codigo)
    {
        try {
            $tiquetes = $this->ticketService->obtenerTiquetesReserva($codigo);

            return response()->json([
                'tiquetes' => $tiquetes,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'No se encontraron tiquetes para esta reserva',
            ], 404);
        }
    }

    /**
     * Enviar tiquetes por correo
     */
    public function sendEmail(Request $request)
    {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'correo' => 'required|email',
        ]);

        try {
            $enviado = $this->ticketService->enviarTiquetesPorCorreo(
                $request->reserva_id,
                $request->correo
            );

            if ($enviado) {
                return response()->json([
                    'success' => true,
                    'mensaje' => 'Tiquetes enviados exitosamente',
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'mensaje' => 'Error al enviar tiquetes',
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Error al enviar tiquetes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Validar tiquete (AJAX)
     */
    public function validate(string $codigo)
    {
        $resultado = $this->ticketService->validarTiquete($codigo);

        return response()->json($resultado);
    }
}
