<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 featured packages (mix of Hajj and Umrah)
        Package::factory(3)->featured()->hajj()->create();
        Package::factory(2)->featured()->umrah()->create();

        // Create 10 regular Hajj packages
        Package::factory(10)->hajj()->create();

        // Create 8 regular Umrah packages
        Package::factory(8)->umrah()->create();
    }
}
