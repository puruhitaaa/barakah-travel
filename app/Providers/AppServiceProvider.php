<?php

namespace App\Providers;

use App\Models\Booking;
use App\Models\Package;
use App\Observers\BookingObserver;
use App\Observers\PackageObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Booking::observe(BookingObserver::class);
        Package::observe(PackageObserver::class);
    }
}
