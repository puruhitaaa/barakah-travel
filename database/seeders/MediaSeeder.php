<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Package;
use Illuminate\Database\Seeder;

class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all packages and attach media to each
        $packages = Package::all();

        foreach ($packages as $package) {
            // Attach 2-4 media items per package
            Media::factory(fake()->numberBetween(2, 4))->create([
                'mediable_id' => $package->id,
                'mediable_type' => Package::class,
            ]);
        }
    }
}
