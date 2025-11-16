<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_reference' => 'BK-'.Str::upper(Str::random(8)),
            'status' => 'pending',
            'notes' => fake()->optional()->paragraph(),
            'user_id' => User::factory(),
            'package_id' => Package::factory(),
        ];
    }
}
