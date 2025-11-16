<?php

use App\Http\Requests\Media\StoreMediaRequest;
use App\Http\Requests\Packages\StorePackageRequest;
use App\Http\Requests\Transactions\StoreTransactionRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

dataset('transactionStatuses', [
    ['pending', true],
    ['success', true],
    ['failed', true],
    ['processing', false],
    ['', false],
    ['ok', false],
]);

it('validates transaction status values', function (string $status, bool $shouldPass) {
    $payload = [
        'amount' => 100,
        'status' => $status,
        'reference_number' => 'TXN-'.uniqid(),
        'booking_id' => \App\Models\Booking::factory()->create()->id,
    ];

    $validator = Validator::make($payload, (new StoreTransactionRequest)->rules());
    expect($validator->fails())->toBe(! $shouldPass);
})->with('transactionStatuses');

dataset('mediaTypes', [
    ['image', true],
    ['video', true],
    ['document', false],
    ['gif', false],
    ['', false],
]);

it('validates media type values', function (string $type, bool $shouldPass) {
    $payload = [
        'mediable_type' => \App\Models\Package::class,
        'mediable_id' => \App\Models\Package::factory()->create()->id,
        'type' => $type,
        'path' => 'uploads/example.jpg',
    ];

    $validator = Validator::make($payload, (new StoreMediaRequest)->rules());
    expect($validator->fails())->toBe(! $shouldPass);
})->with('mediaTypes');

it('validates package type values', function (string $type, bool $shouldPass) {
    $payload = [
        'name' => 'Pkg',
        'type' => $type,
        'duration_days' => 10,
        'price' => 1000,
        'departure_date' => now()->toDateString(),
        'return_date' => now()->addDays(10)->toDateString(),
        'available_slots' => 10,
    ];

    $validator = Validator::make($payload, (new StorePackageRequest)->rules());
    expect($validator->fails())->toBe(! $shouldPass);
})->with([
    ['hajj', true],
    ['umrah', true],
    ['tour', false],
    ['', false],
]);
