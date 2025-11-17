<?php

namespace Database\Seeders;

use App\Models\Itinerary;
use App\Models\Package;
use Illuminate\Database\Seeder;

class ItineraryPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all packages and itineraries
        $packages = Package::all();
        $itineraries = Itinerary::all();

        // Attach 2-3 random itineraries to each package
        foreach ($packages as $package) {
            $randomItineraries = $itineraries
                ->random(fake()->numberBetween(2, 3))
                ->pluck('id')
                ->toArray();

            $package->itineraries()->attach($randomItineraries);
        }
    }
}
