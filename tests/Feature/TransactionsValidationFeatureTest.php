<?php

use App\Http\Requests\Transactions\StoreTransactionRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

dataset('invalidTransactions', [
    fn () => [
        'amount' => -1,
    ],
    fn () => [
        'payment_method' => str_repeat('a', 65),
    ],
    fn () => [
        'booking_id' => 999999,
    ],
    fn () => [
        'gateway_id' => -5,
    ],
]);

it('validates transaction payloads fail on edge cases', function (callable $factory) {
    $base = [
        'amount' => 100,
        'status' => 'pending',
        'reference_number' => 'TXN-'.uniqid(),
        'booking_id' => \App\Models\Booking::factory()->create()->id,
    ];

    $payload = array_merge($base, $factory());

    $validator = Validator::make($payload, (new StoreTransactionRequest)->rules());
    expect($validator->fails())->toBeTrue();
})->with('invalidTransactions');
