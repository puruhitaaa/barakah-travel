<?php

use App\Http\Controllers\Admin\AccommodationController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ItineraryController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\TransportationController;
use App\Http\Controllers\BookingPaymentController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\Staff\BookingController as StaffBookingController;
use App\Http\Controllers\Staff\DashboardController as StaffDashboardController;
use App\Http\Controllers\Staff\TransactionController as StaffTransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('home');
Route::get('/packages', [LandingController::class, 'packages'])->name('packages');
Route::get('/packages/{package}', [LandingController::class, 'show'])->name('packages.show');

// Midtrans webhook (no auth required)
Route::post('/webhook/midtrans', [BookingPaymentController::class, 'webhook'])->name('webhook.midtrans');

Route::middleware(['auth', 'verified'])->group(function () {
    // Booking payment routes
    Route::prefix('booking')->name('booking.')->group(function () {
        Route::post('payment', [BookingPaymentController::class, 'store'])->name('payment.store');
        Route::get('payment/success', [BookingPaymentController::class, 'success'])->name('payment.success');
        Route::get('payment/error', [BookingPaymentController::class, 'error'])->name('payment.error');
        Route::get('payment/pending', [BookingPaymentController::class, 'pending'])->name('payment.pending');
    });

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('packages', PackageController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('accommodations', AccommodationController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('transportations', TransportationController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('itineraries', ItineraryController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('bookings', BookingController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('payment-gateways', PaymentGatewayController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('transactions', TransactionController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('media', MediaController::class)->only(['index', 'store', 'update', 'destroy']);
    });

    Route::prefix('staff')->name('staff.')->middleware('role:staff')->group(function () {
        Route::get('dashboard', [StaffDashboardController::class, 'index'])->name('dashboard');
        Route::resource('bookings', StaffBookingController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('transactions', StaffTransactionController::class)->only(['index', 'store', 'update', 'destroy']);
    });
});

require __DIR__.'/settings.php';
