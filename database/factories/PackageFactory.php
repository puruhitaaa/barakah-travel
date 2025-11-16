<?php

namespace Database\Factories;

use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Package>
 */
class PackageFactory extends Factory
{
    protected $model = Package::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $duration = fake()->numberBetween(7, 30);
        $departure = fake()->dateTimeBetween('+1 week', '+3 months');
        $return = Carbon::instance($departure)->copy()->addDays($duration);

        return [
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->paragraphs(2, true),
            'type' => fake()->randomElement(['hajj', 'umrah']),
            'duration_days' => $duration,
            'price' => fake()->randomFloat(2, 500, 5000),
            'departure_date' => Carbon::instance($departure)->toDateString(),
            'return_date' => $return->toDateString(),
            'available_slots' => fake()->numberBetween(0, 200),
            'is_featured' => fake()->boolean(20),
        ];
    }

    public function hajj(): static
    {
        return $this->state(fn () => ['type' => 'hajj']);
    }

    public function umrah(): static
    {
        return $this->state(fn () => ['type' => 'umrah']);
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true]);
    }
}
