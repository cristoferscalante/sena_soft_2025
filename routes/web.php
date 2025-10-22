<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FlightController;
use App\Http\Controllers\SeatController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ReceiptController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas Públicas - Sistema de Vuelos
|--------------------------------------------------------------------------
*/

// Página principal - redirige a búsqueda de vuelos
Route::get('/', function () {
    return redirect()->route('flights.index');
});

// Páginas adicionales
Route::get('/contacto', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/mis-viajes', function () {
    return Inertia::render('MyTrips');
})->name('my-trips');

Route::get('/terminos-condiciones', function () {
    return Inertia::render('TermsConditions');
})->name('terms');

// Búsqueda de vuelos
Route::prefix('vuelos')->name('flights.')->group(function () {
    Route::get('/', [FlightController::class, 'index'])->name('index');
    Route::get('/buscar', [FlightController::class, 'index'])->name('search'); // Alias para mostrar formulario
    Route::post('/buscar', [FlightController::class, 'search'])->name('search.post'); // Procesar búsqueda
    Route::get('/api/ciudades', [FlightController::class, 'autocompleteCiudades'])->name('ciudades');
    Route::get('/{id}', [FlightController::class, 'show'])->where('id', '[0-9]+')->name('show'); // Solo números
});

// Selección de asientos
Route::prefix('asientos')->name('seats.')->group(function () {
    Route::get('/', [SeatController::class, 'index'])->name('index');
    Route::post('/reservar', [SeatController::class, 'reserve'])->name('reserve');
    Route::post('/verificar-disponibilidad', [SeatController::class, 'checkAvailability'])->name('check');
});

// Reservas
Route::prefix('reservas')->name('booking.')->group(function () {
    Route::get('/crear', [BookingController::class, 'create'])->name('create');
    Route::post('/', [BookingController::class, 'store'])->name('store');
    Route::get('/gracias/{reserva_id}', [PaymentController::class, 'thankYou'])->name('thankyou');
    Route::get('/{codigo}', [BookingController::class, 'show'])->name('show');
    Route::post('/{id}/cancelar', [BookingController::class, 'cancel'])->name('cancel');
});

// Pagos
Route::prefix('pagos')->name('payment.')->group(function () {
    Route::get('/{reserva}', [PaymentController::class, 'create'])->name('create');
    Route::post('/credito', [PaymentController::class, 'processCredit'])->name('credit');
    Route::post('/debito', [PaymentController::class, 'processDebit'])->name('debit');
    Route::post('/pse', [PaymentController::class, 'processPSE'])->name('pse');
});

// Tiquetes
Route::prefix('tiquetes')->name('tickets.')->group(function () {
    Route::get('/{id}/descargar', [TicketController::class, 'download'])->name('download');
    Route::get('/reserva/{codigo}', [TicketController::class, 'getTiquetesReserva'])->name('reserva');
    Route::get('/reserva/{codigo}/pdf', [TicketController::class, 'downloadReservaPDF'])->name('reserva.pdf');
    Route::post('/enviar-email', [TicketController::class, 'sendEmail'])->name('email');
    Route::get('/validar/{codigo}', [TicketController::class, 'validate'])->name('validate');
});

// Recibos de pago
Route::prefix('recibos')->name('receipts.')->group(function () {
    Route::get('/{referencia}/descargar', [ReceiptController::class, 'download'])->name('download');
    Route::get('/{referencia}/ver', [ReceiptController::class, 'view'])->name('view');
    Route::get('/{referencia}/info', [ReceiptController::class, 'info'])->name('info');
    Route::get('/reserva/{codigo}', [ReceiptController::class, 'listByReservation'])->name('reserva');
});

/*
|--------------------------------------------------------------------------
| Rutas de Admin
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    // Login de admin
    Route::get('/login', [App\Http\Controllers\Admin\AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [App\Http\Controllers\Admin\AdminAuthController::class, 'login'])->name('login.post');

    // Rutas protegidas de admin
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardAdminController::class, 'index'])->name('dashboard');
        Route::post('/logout', [App\Http\Controllers\Admin\AdminAuthController::class, 'logout'])->name('logout');

        // Gestión de recursos
        Route::resource('vuelos', App\Http\Controllers\Admin\VueloAdminController::class);
        Route::resource('ciudades', App\Http\Controllers\Admin\CiudadAdminController::class);
        Route::resource('aeronaves', App\Http\Controllers\Admin\AeronaveAdminController::class);

        // Reservas (solo lectura)
        Route::get('/reservas', [App\Http\Controllers\Admin\ReservaAdminController::class, 'index'])->name('reservas.index');
        Route::get('/reservas/{id}', [App\Http\Controllers\Admin\ReservaAdminController::class, 'show'])->name('reservas.show');
    });
});

/*
|--------------------------------------------------------------------------
| Rutas de Autenticación (Usuario Normal)
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
