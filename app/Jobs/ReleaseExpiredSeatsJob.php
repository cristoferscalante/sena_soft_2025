<?php

namespace App\Jobs;

use App\Services\BookingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ReleaseExpiredSeatsJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(BookingService $bookingService): void
    {
        Log::info('Iniciando liberación de asientos de reservas expiradas...');

        try {
            $liberadas = $bookingService->liberarReservasExpiradas();
            
            if ($liberadas > 0) {
                Log::info("✅ Se liberaron {$liberadas} reservas expiradas");
            } else {
                Log::info('No hay reservas expiradas para liberar');
            }
        } catch (\Exception $e) {
            Log::error('Error al liberar reservas expiradas: ' . $e->getMessage());
            throw $e;
        }
    }
}
