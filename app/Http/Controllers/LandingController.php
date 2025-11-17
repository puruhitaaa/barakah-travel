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

    public function packages(Request $request): Response
    {
        $perPage = 6;

        // Get all packages with booking counts
        $allPackages = Package::withCount('bookings')
            ->orderByDesc('bookings_count')
            ->get()
            ->map(function ($package) {
                // Determine group size based on type
                $groupSizes = [
                    'hajj' => '30-50 Pilgrims',
                    'umrah' => '10-30 Pilgrims',
                ];

                // Generate features based on package type
                $features = $package->type === 'hajj'
                    ? [
                        'Complete Hajj rituals guidance',
                        'Dedicated support team',
                        'All meals & special provisions',
                    ]
                    : [
                        'Hotel accommodation',
                        'Guided Umrah tours',
                        'All meals included',
                    ];

                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'type' => $package->type,
                    'duration_days' => $package->duration_days,
                    'duration' => $package->duration_days . ' Days',
                    'price' => '$' . number_format($package->price),
                    'description' => $package->description,
                    'group' => $groupSizes[$package->type] ?? '10-30 Pilgrims',
                    'departure' => 'As scheduled',
                    'booking_count' => $package->bookings_count,
                    'featured' => $package->is_featured,
                    'features' => $features,
                    'highlights' => $package->is_featured ? ['Most popular'] : [],
                ];
            });

        $totalPackages = $allPackages->count();
        $currentPage = (int) ($request->query('page') ?? 1);
        $packages = $allPackages->slice(($currentPage - 1) * $perPage, $perPage)->values();
        $totalPages = (int) ceil($totalPackages / $perPage);

        return Inertia::render('packages/index', [
            'packages' => $packages,
            'totalPackages' => $totalPackages,
            'currentPage' => $currentPage,
            'perPage' => $perPage,
            'totalPages' => $totalPages,
        ]);
    }
}
