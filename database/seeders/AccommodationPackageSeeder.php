<?php

namespace Database\Seeders;

use App\Models\Accommodation;
use App\Models\Package;
use Illuminate\Database\Seeder;

class AccommodationPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all packages and accommodations
        $packages = Package::all();
        $accommodations = Accommodation::all();

        // Attach 2-4 random accommodations to each package
        foreach ($packages as $package) {
            $randomAccommodations = $accommodations
                ->random(fake()->numberBetween(2, 4))
                ->pluck('id')
                ->toArray();

            $package->accommodations()->attach($randomAccommodations);
        }
    }
}
