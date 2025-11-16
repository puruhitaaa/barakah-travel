<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

function hasIndexOn(string $table, array $columns): bool
{
    $indexes = collect(DB::select("PRAGMA index_list('$table')"))->pluck('name');

    foreach ($indexes as $indexName) {
        $info = collect(DB::select("PRAGMA index_info('$indexName')"))->pluck('name')->all();
        if (empty($info)) {
            continue;
        }
        $target = collect($columns);
        if ($target->every(fn ($c) => in_array($c, $info, true))) {
            return true;
        }
    }

    return false;
}

it('has expected single-column indexes', function () {
    expect(hasIndexOn('packages', ['type']))->toBeTrue();
    expect(hasIndexOn('packages', ['departure_date']))->toBeTrue();
    expect(hasIndexOn('packages', ['return_date']))->toBeTrue();
    expect(hasIndexOn('packages', ['is_featured']))->toBeTrue();
    expect(hasIndexOn('bookings', ['status']))->toBeTrue();
    expect(hasIndexOn('transactions', ['status']))->toBeTrue();
    expect(hasIndexOn('payment_gateways', ['is_active']))->toBeTrue();
});

it('has expected composite indexes', function () {
    expect(hasIndexOn('transactions', ['gateway_type', 'gateway_id']))->toBeTrue();
    expect(hasIndexOn('media', ['mediable_type', 'mediable_id']))->toBeTrue();
});
