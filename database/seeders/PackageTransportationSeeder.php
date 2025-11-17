<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Transportation;
use Illuminate\Database\Seeder;

class PackageTransportationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all packages and transportations
        $packages = Package::all();
        $transportations = Transportation::all();

        // Attach 1-3 random transportations to each package
        foreach ($packages as $package) {
            $randomTransportations = $transportations
                ->random(fake()->numberBetween(1, 3))
                ->pluck('id')
                ->toArray();

            $package->transportations()->attach($randomTransportations);
        }
    }
}
