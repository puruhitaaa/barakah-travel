<?php

namespace Database\Factories;

use App\Models\Accommodation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Accommodation>
 */
class AccommodationFactory extends Factory
{
    protected $model = Accommodation::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company().' '.fake()->word(),
            'type' => fake()->randomElement(['hotel', 'apartment', 'guesthouse']),
            'location' => fake()->city(),
            'rating' => round(fake()->randomFloat(1, 0, 5), 1),
            'description' => fake()->optional()->paragraph(),
        ];
    }
}
