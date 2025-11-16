<?php

use App\Http\Requests\Packages\StorePackageRequest;
use App\Models\Accommodation;
use App\Models\Itinerary;
use App\Models\Media;
use App\Models\Package;
use App\Models\Transportation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

it('creates package and attaches related models', function () {
    $package = Package::factory()->create();
    $accommodations = Accommodation::factory()->count(2)->create();
    $transportations = Transportation::factory()->count(2)->create();
    $itineraries = Itinerary::factory()->count(3)->create();

    $package->accommodations()->sync($accommodations->pluck('id'));
    $package->transportations()->sync($transportations->pluck('id'));
    $package->itineraries()->sync($itineraries->pluck('id'));

    Media::factory()->state([
        'mediable_type' => Package::class,
        'mediable_id' => $package->id,
    ])->image()->create();

    Media::factory()->state([
        'mediable_type' => Package::class,
        'mediable_id' => $package->id,
    ])->video()->create();

    $package->load('accommodations', 'transportations', 'itineraries', 'media');

    expect($package->accommodations)->toHaveCount(2);
    expect($package->transportations)->toHaveCount(2);
    expect($package->itineraries)->toHaveCount(3);
    expect($package->media)->toHaveCount(2);
});

it('prevents duplicate pivots on package relations', function () {
    $package = Package::factory()->create();
    $accommodation = Accommodation::factory()->create();

    $package->accommodations()->attach($accommodation->id);

    expect(fn () => $package->accommodations()->attach($accommodation->id))
        ->toThrow(\Illuminate\Database\QueryException::class);
});

dataset('validPackageTypes', ['hajj', 'umrah']);

it('validates allowed package type', function (string $type) {
    $payload = [
        'name' => 'Pkg',
        'type' => $type,
        'duration_days' => 10,
        'price' => 1000,
        'departure_date' => now()->toDateString(),
        'return_date' => now()->addDays(10)->toDateString(),
        'available_slots' => 10,
    ];

    $request = new StorePackageRequest;
    $validator = Validator::make($payload, $request->rules());
    expect($validator->fails())->toBeFalse();
})->with('validPackageTypes');

dataset('invalidPackageTypes', ['tour', '', 'HAJJ', 'umrahh']);

it('rejects invalid package type', function (string $type) {
    $payload = [
        'name' => 'Pkg',
        'type' => $type,
        'duration_days' => 10,
        'price' => 1000,
        'departure_date' => now()->toDateString(),
        'return_date' => now()->addDays(10)->toDateString(),
        'available_slots' => 10,
    ];

    $request = new StorePackageRequest;
    $validator = Validator::make($payload, $request->rules());
    expect($validator->fails())->toBeTrue();
})->with('invalidPackageTypes');

it('accepts package boundary values', function () {
    $d = now()->toDateString();
    $payload = [
        'name' => 'Pkg',
        'type' => 'hajj',
        'duration_days' => 1,
        'price' => 0,
        'departure_date' => $d,
        'return_date' => $d,
        'available_slots' => 0,
        'is_featured' => true,
    ];

    $validator = Validator::make($payload, (new StorePackageRequest)->rules());
    expect($validator->fails())->toBeFalse();
});

it('accepts max price boundary', function () {
    $d = now()->toDateString();
    $payload = [
        'name' => 'Pkg',
        'type' => 'hajj',
        'duration_days' => 10,
        'price' => 99999999.99,
        'departure_date' => $d,
        'return_date' => $d,
        'available_slots' => 10,
    ];

    $validator = Validator::make($payload, (new StorePackageRequest)->rules());
    expect($validator->fails())->toBeFalse();
});

dataset('packageInvalidEdges', [
    ['duration_days', 0],
    ['duration_days', 366],
    ['price', -1],
    ['price', 100000000],
    ['available_slots', -5],
]);

it('rejects invalid numeric boundaries', function (string $key, int|float $value) {
    $d = now()->toDateString();
    $payload = [
        'name' => 'Pkg',
        'type' => 'umrah',
        'duration_days' => 10,
        'price' => 1000,
        'departure_date' => $d,
        'return_date' => now()->addDays(10)->toDateString(),
        'available_slots' => 10,
    ];
    $payload[$key] = $value;

    $validator = Validator::make($payload, (new StorePackageRequest)->rules());
    expect($validator->fails())->toBeTrue();
})->with('packageInvalidEdges');

it('rejects return_date before departure_date', function () {
    $payload = [
        'name' => 'Pkg',
        'type' => 'hajj',
        'duration_days' => 10,
        'price' => 1000,
        'departure_date' => now()->addDays(5)->toDateString(),
        'return_date' => now()->toDateString(),
        'available_slots' => 10,
    ];

    $validator = Validator::make($payload, (new StorePackageRequest)->rules());
    expect($validator->fails())->toBeTrue();
});
