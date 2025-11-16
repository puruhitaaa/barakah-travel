<?php

namespace Database\Factories;

use App\Models\Itinerary;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Itinerary>
 */
class ItineraryFactory extends Factory
{
    protected $model = Itinerary::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'day_number' => fake()->numberBetween(1, 14),
            'title' => fake()->sentence(3),
            'description' => fake()->optional()->paragraphs(2, true),
            'location' => fake()->city(),
        ];
    }
}
