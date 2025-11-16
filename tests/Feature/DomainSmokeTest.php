<?php

use App\Http\Requests\Media\StoreMediaRequest;
use App\Http\Requests\Packages\StorePackageRequest;
use App\Http\Requests\Transactions\StoreTransactionRequest;
use App\Models\Accommodation;
use App\Models\Booking;
use App\Models\Itinerary;
use App\Models\Media;
use App\Models\Package;
use App\Models\PaymentGateway;
use App\Models\Transportation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

dataset('packageTypes', [
    ['hajj', true],
    ['umrah', true],
    ['tour', false],
    ['', false],
]);

dataset('transactionStatuses', [
    ['pending', true],
    ['success', true],
    ['failed', true],
    ['processing', false],
]);

dataset('mediaTypes', [
    ['image', true],
    ['video', true],
    ['document', false],
]);

dataset('packageInvalidEdges', [
    ['duration_days', 0],
    ['duration_days', 366],
    ['price', -1],
    ['available_slots', -5],
]);

function hasIndex(string $table, array $columns): bool
{
    $indexes = collect(DB::select("PRAGMA index_list('$table')"))->pluck('name');
    foreach ($indexes as $indexName) {
        $cols = collect(DB::select("PRAGMA index_info('$indexName')"))->pluck('name')->all();
        if (empty($cols)) {
            continue;
        }
        if (collect($columns)->every(fn ($c) => in_array($c, $cols, true))) {
            return true;
        }
    }

    return false;
}

it('smoke: end-to-end create graph and assert relations', function () {
    $package = Package::factory()->featured()->create();
    $accommodations = Accommodation::factory()->count(2)->create();
    $transportations = Transportation::factory()->count(2)->create();
    $itineraries = Itinerary::factory()->count(3)->create();

    $package->accommodations()->sync($accommodations->pluck('id'));
    $package->transportations()->sync($transportations->pluck('id'));
    $package->itineraries()->sync($itineraries->pluck('id'));

    $booking = Booking::factory()->create(['package_id' => $package->id]);
    $gateway = PaymentGateway::factory()->active()->create();
    $txn = \App\Models\Transaction::factory()->success()->create([
        'booking_id' => $booking->id,
        'gateway_type' => PaymentGateway::class,
        'gateway_id' => $gateway->id,
    ]);

    Media::factory()->image()->state([
        'mediable_type' => Package::class,
        'mediable_id' => $package->id,
    ])->create();

    $package->load('accommodations', 'transportations', 'itineraries', 'media');

    expect($package->accommodations)->toHaveCount(2);
    expect($package->transportations)->toHaveCount(2);
    expect($package->itineraries)->toHaveCount(3);
    expect($package->media)->toHaveCount(1);
    expect($txn->gateway)->toBeInstanceOf(PaymentGateway::class);
});

it('smoke: validates package type dataset', function (string $type, bool $pass) {
    $payload = [
        'name' => 'Pkg',
        'type' => $type,
        'duration_days' => 10,
        'price' => 1000,
        'departure_date' => now()->toDateString(),
        'return_date' => now()->addDays(10)->toDateString(),
        'available_slots' => 10,
    ];
    $result = Validator::make($payload, (new StorePackageRequest)->rules())->fails();
    expect($result)->toBe(! $pass);
})->with('packageTypes');

it('smoke: validates transaction status dataset', function (string $status, bool $pass) {
    $payload = [
        'amount' => 100,
        'status' => $status,
        'reference_number' => 'TXN-'.uniqid(),
        'booking_id' => Booking::factory()->create()->id,
    ];
    $result = Validator::make($payload, (new StoreTransactionRequest)->rules())->fails();
    expect($result)->toBe(! $pass);
})->with('transactionStatuses');

it('smoke: validates media type dataset', function (string $type, bool $pass) {
    $payload = [
        'mediable_type' => Package::class,
        'mediable_id' => Package::factory()->create()->id,
        'type' => $type,
        'path' => 'uploads/example.jpg',
    ];
    $result = Validator::make($payload, (new StoreMediaRequest)->rules())->fails();
    expect($result)->toBe(! $pass);
})->with('mediaTypes');

it('smoke: accepts minimal boundary values for package', function () {
    $d = now()->toDateString();
    $payload = [
        'name' => 'Pkg',
        'type' => 'hajj',
        'duration_days' => 1,
        'price' => 0,
        'departure_date' => $d,
        'return_date' => $d,
        'available_slots' => 0,
    ];
    expect(Validator::make($payload, (new StorePackageRequest)->rules())->fails())->toBeFalse();
});

it('smoke: rejects invalid numeric boundaries', function (string $key, int|float $value) {
    $payload = [
        'name' => 'Pkg',
        'type' => 'umrah',
        'duration_days' => 10,
        'price' => 1000,
        'departure_date' => now()->toDateString(),
        'return_date' => now()->addDays(10)->toDateString(),
        'available_slots' => 10,
    ];
    $payload[$key] = $value;
    expect(Validator::make($payload, (new StorePackageRequest)->rules())->fails())->toBeTrue();
})->with('packageInvalidEdges');

it('smoke: has critical indexes', function () {
    expect(hasIndex('packages', ['type']))->toBeTrue();
    expect(hasIndex('transactions', ['gateway_type', 'gateway_id']))->toBeTrue();
    expect(hasIndex('media', ['mediable_type', 'mediable_id']))->toBeTrue();
});
