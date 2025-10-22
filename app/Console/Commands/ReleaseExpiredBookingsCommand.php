<?php

namespace App\Console\Commands;

use App\Services\BookingService;
use Illuminate\Console\Command;

class ReleaseExpiredBookingsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:release-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Liberar asientos de reservas expiradas';

    /**
     * Execute the console command.
     */
    public function handle(BookingService $bookingService): int
    {
        $this->info('🔍 Buscando reservas expiradas...');

        try {
            $liberadas = $bookingService->liberarReservasExpiradas();

            if ($liberadas > 0) {
                $this->info("✅ Se liberaron {$liberadas} reservas expiradas");
                $this->info("   - Asientos devueltos al inventario disponible");
            } else {
                $this->info('✓ No hay reservas expiradas para liberar');
            }

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Error al liberar reservas: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
