<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\PaymentGateway;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount' => fake()->randomFloat(2, 500, 10000),
            'status' => fake()->randomElement(['pending', 'success', 'failed']),
            'payment_method' => fake()->randomElement(['card', 'bank_transfer', 'cash', 'wallet']),
            'reference_number' => strtoupper(fake()->bothify('TXN-########')),
            'booking_id' => Booking::factory(),
            'gateway_type' => PaymentGateway::class,
            'gateway_id' => PaymentGateway::factory(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }

    public function success(): static
    {
        return $this->state(fn () => ['status' => 'success']);
    }

    public function failed(): static
    {
        return $this->state(fn () => ['status' => 'failed']);
    }
}
