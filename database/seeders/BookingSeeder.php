<?php

namespace Database\Seeders;

use App\Models\Booking;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 30 bookings with various statuses
        Booking::factory(10)->create(['status' => 'pending']);
        Booking::factory(12)->create(['status' => 'confirmed']);
        Booking::factory(5)->create(['status' => 'cancelled']);
        Booking::factory(3)->create(['status' => 'completed']);
    }
}
