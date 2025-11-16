<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    protected $model = Media::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['image', 'video']);

        return [
            'mediable_type' => Package::class,
            'mediable_id' => Package::factory(),
            'type' => $type,
            'disk' => 'public',
            'path' => 'uploads/'.fake()->uuid().($type === 'image' ? '.jpg' : '.mp4'),
            'mime_type' => $type === 'image' ? 'image/jpeg' : 'video/mp4',
            'size' => fake()->numberBetween(50_000, 5_000_000),
            'alt_text' => fake()->optional()->sentence(6),
            'ordering' => fake()->numberBetween(0, 10),
        ];
    }

    public function image(): static
    {
        return $this->state(fn () => ['type' => 'image', 'mime_type' => 'image/jpeg']);
    }

    public function video(): static
    {
        return $this->state(fn () => ['type' => 'video', 'mime_type' => 'video/mp4']);
    }
}
