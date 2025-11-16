<?php

namespace Database\Factories;

use App\Models\Transportation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transportation>
 */
class TransportationFactory extends Factory
{
    protected $model = Transportation::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['bus', 'flight', 'train', 'van']),
            'company' => fake()->company(),
            'capacity' => fake()->numberBetween(10, 300),
            'description' => fake()->optional()->paragraph(),
        ];
    }
}
