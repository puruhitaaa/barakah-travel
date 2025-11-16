<?php

use App\Http\Requests\Bookings\StoreBookingRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

dataset('invalidBookings', [
    fn () => [
        'status' => str_repeat('a', 33),
        'user_id' => 999999,
        'package_id' => 999999,
    ],
    fn () => [
        'status' => '',
        'user_id' => 1,
        'package_id' => 1,
    ],
]);

it('validates booking payloads fail on edge cases', function (callable $factory) {
    $base = [
        'status' => 'pending',
        'user_id' => \App\Models\User::factory()->create()->id,
        'package_id' => \App\Models\Package::factory()->create()->id,
    ];
    $payload = array_merge($base, $factory());

    $validator = Validator::make($payload, (new StoreBookingRequest)->rules());
    expect($validator->fails())->toBeTrue();
})->with('invalidBookings');
