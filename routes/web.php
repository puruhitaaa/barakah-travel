<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\Admin\AccommodationController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ItineraryController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\TransportationController;
use App\Http\Controllers\Staff\BookingController as StaffBookingController;
use App\Http\Controllers\Staff\DashboardController as StaffDashboardController;
use App\Http\Controllers\Staff\TransactionController as StaffTransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [LandingController::class, 'index'])->name('home');
Route::get('/packages', [LandingController::class, 'packages'])->name('packages');
Route::get('/packages/{package}', [LandingController::class, 'show'])->name('packages.show');

Route::middleware(['auth', 'verified'])->group(function () {
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
