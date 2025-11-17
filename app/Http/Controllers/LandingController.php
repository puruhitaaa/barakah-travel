<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

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

        // Get total package count
        $totalPackages = Package::count();

        return Inertia::render('welcome', [
            'packages' => $packages,
            'totalPackages' => $totalPackages,
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
                    'price' => (float) $package->price,
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

        // Get packages for comparison (top 4)
        $comparisonPackages = Package::orderByDesc('is_featured')
            ->limit(4)
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'price' => $package->price,
                ];
            });

        // Generate comparison data from packages
        $comparisonData = [
            [
                'feature' => 'Duration (Days)',
                ...array_reduce(
                    $comparisonPackages->values()->all(),
                    function ($result, $pkg) {
                        $package = Package::find($pkg['id']);
                        $result['pkg_' . $pkg['id']] = $package->duration_days . ' Days';
                        return $result;
                    },
                    []
                ),
            ],
            [
                'feature' => 'Price',
                ...array_reduce(
                    $comparisonPackages->values()->all(),
                    function ($result, $pkg) {
                        $result['pkg_' . $pkg['id']] = $pkg['price'];
                        return $result;
                    },
                    []
                ),
            ],
            [
                'feature' => 'Hotel Rating',
                'pkg_' . ($comparisonPackages[0]['id'] ?? null) => '3-star',
                'pkg_' . ($comparisonPackages[1]['id'] ?? null) => '4-star',
                'pkg_' . ($comparisonPackages[2]['id'] ?? null) => '4-star',
                'pkg_' . ($comparisonPackages[3]['id'] ?? null) => '5-star',
            ],
            [
                'feature' => '24/7 Support',
                'pkg_' . ($comparisonPackages[0]['id'] ?? null) => false,
                'pkg_' . ($comparisonPackages[1]['id'] ?? null) => true,
                'pkg_' . ($comparisonPackages[2]['id'] ?? null) => true,
                'pkg_' . ($comparisonPackages[3]['id'] ?? null) => true,
            ],
            [
                'feature' => 'Travel Insurance',
                'pkg_' . ($comparisonPackages[0]['id'] ?? null) => false,
                'pkg_' . ($comparisonPackages[1]['id'] ?? null) => false,
                'pkg_' . ($comparisonPackages[2]['id'] ?? null) => false,
                'pkg_' . ($comparisonPackages[3]['id'] ?? null) => true,
            ],
        ];

        return Inertia::render('packages/index', [
            'packages' => $packages,
            'comparisonPackages' => $comparisonPackages,
            'comparisonData' => $comparisonData,
            'totalPackages' => $totalPackages,
            'currentPage' => $currentPage,
            'perPage' => $perPage,
            'totalPages' => $totalPages,
        ]);
    }

    public function show(Package $package): Response
    {
        // Load relationships
        $package->load(['bookings', 'accommodations', 'transportations', 'itineraries']);

        // Transform package data
        $transformedPackage = [
            'id' => $package->id,
            'name' => $package->name,
            'type' => $package->type,
            'duration' => $package->duration_days . ' Days',
            'duration_days' => $package->duration_days,
            'price' => (float) $package->price,
            'description' => $package->description,
            'full_description' => $package->description,
            'group' => match ($package->type) {
                'hajj' => '30-50 Pilgrims',
                'umrah' => '10-30 Pilgrims',
                default => '10-30 Pilgrims',
            },
            'departure' => $package->departure_date
                ? $package->departure_date->format('M Y')
                : 'As scheduled',
            'rating' => 4.8,
            'reviews' => $package->bookings_count * 5,
            'image' => $package->image ?? '/placeholder.svg?height=600&width=800',
            'includes' => $this->getPackageInclusions($package),
            'excludes' => [
                'Travel insurance',
                'Personal expenses',
                'Visa fees',
            ],
            'itinerary' => $this->buildItinerary($package),
        ];

        return Inertia::render('packages/show', [
            'package' => $transformedPackage,
        ]);
    }

    /**
     * Get package inclusions based on type and relationships
     */
    private function getPackageInclusions(Package $package): array
    {
        $inclusions = [];

        // Add accommodation info
        if ($package->accommodations->isNotEmpty()) {
            $inclusions[] = $package->accommodations->first()->name . ' accommodation';
        } else {
            $inclusions[] = match ($package->type) {
                'hajj' => '5-star hotel accommodations',
                'umrah' => '4-star hotel accommodations',
                default => '3-star hotel accommodations',
            };
        }

        // Add common inclusions
        $inclusions = array_merge($inclusions, [
            match ($package->type) {
                'hajj' => 'Complete Hajj rituals guidance',
                'umrah' => 'Guided Umrah tours',
                default => 'Guided tours',
            },
            'All meals included',
            'Airport transfers',
            'Professional guides',
        ]);

        if ($package->bookings_count > 50) {
            $inclusions[] = '24/7 support hotline';
        }

        return $inclusions;
    }

    /**
     * Build itinerary from package itineraries
     */
    private function buildItinerary(Package $package): array
    {
        if ($package->itineraries->isEmpty()) {
            return $this->getDefaultItinerary($package->duration_days, $package->type);
        }

        return $package->itineraries
            ->sortBy('day')
            ->map(function ($itinerary, $index) {
                return [
                    'day' => $itinerary->day ?? ($index + 1),
                    'title' => $itinerary->title ?? "Day " . ($index + 1),
                    'description' => $itinerary->description ?? 'Scheduled activities and exploration',
                    'activities' => $this->parseActivities($itinerary->activities),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Parse activities from string or array format
     */
    private function parseActivities(mixed $activities): array
    {
        if (is_array($activities)) {
            return $activities;
        }

        if (is_string($activities)) {
            return array_map('trim', explode(',', $activities));
        }

        return [];
    }

    /**
     * Get default itinerary based on duration and type
     */
    private function getDefaultItinerary(int $days, string $type): array
    {
        $itinerary = [];

        for ($day = 1; $day <= $days; $day++) {
            if ($day === 1) {
                $itinerary[] = [
                    'day' => $day,
                    'title' => 'Arrival in Jeddah',
                    'description' => 'Arrive at King Abdulaziz International Airport and transfer to accommodation.',
                    'activities' => ['Airport pickup', 'Hotel check-in', 'Orientation briefing'],
                ];
            } elseif ($day === 2) {
                $itinerary[] = [
                    'day' => $day,
                    'title' => match ($type) {
                        'hajj' => 'Hajj Rituals Begin',
                        'umrah' => 'Umrah Rituals Begin',
                        default => 'Spiritual Journey Begins',
                    },
                    'description' => match ($type) {
                        'hajj' => 'Begin sacred Hajj rituals with guided ceremonies.',
                        'umrah' => 'Perform sacred Umrah with experienced guides.',
                        default => 'Begin your spiritual journey.',
                    },
                    'activities' => match ($type) {
                        'hajj' => ['Ihram preparation', 'Tawaf', 'Saei'],
                        'umrah' => ['Tawaf Al-Qudoom', 'Saei', 'Hair trimming'],
                        default => ['Guided tours', 'Prayer sessions'],
                    },
                ];
            } elseif ($day === $days) {
                $itinerary[] = [
                    'day' => $day,
                    'title' => 'Departure',
                    'description' => 'Final prayers and transfer to airport for departure.',
                    'activities' => ['Breakfast and checkout', 'Final prayers', 'Airport transfer'],
                ];
            } else {
                $itinerary[] = [
                    'day' => $day,
                    'title' => match ($type) {
                        'hajj' => 'Hajj Journey - Day ' . $day,
                        'umrah' => 'Umrah Experience - Day ' . $day,
                        default => 'Journey - Day ' . $day,
                    },
                    'description' => 'Continue your spiritual journey with guided activities and explorations.',
                    'activities' => ['Guided tours', 'Religious services', 'Meals and rest'],
                ];
            }
        }

        return $itinerary;
    }
}
