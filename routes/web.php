<?php

use App\Http\Controllers\Admin\AccommodationController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\ItineraryController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\TransportationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::resource('packages', PackageController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('accommodations', AccommodationController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('transportations', TransportationController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('itineraries', ItineraryController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('bookings', BookingController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('payment-gateways', PaymentGatewayController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('transactions', TransactionController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('media', MediaController::class)->only(['index', 'store', 'update', 'destroy']);
    });
});

require __DIR__.'/settings.php';
