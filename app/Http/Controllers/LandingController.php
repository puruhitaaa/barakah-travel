<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(Request $request): Response
    {
        // Get the 3 most popular packages based on booking count
        // Mark the one with the most bookings as featured
        $packages = Package::withCount('bookings')
            ->orderByDesc('bookings_count')
            ->take(3)
            ->get()
            ->map(function ($package, $index) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'type' => $package->type,
                    'duration_days' => $package->duration_days,
                    'price' => $package->price,
                    'description' => $package->description,
                    'departure_date' => $package->departure_date,
                    'available_slots' => $package->available_slots,
                    'booking_count' => $package->bookings_count,
                    // Only the first (most popular) package is featured
                    'featured' => $index === 0,
                ];
            });

        return Inertia::render('welcome', [
            'packages' => $packages,
        ]);
    }
}
