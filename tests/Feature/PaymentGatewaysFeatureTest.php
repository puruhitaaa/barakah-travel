<?php

use App\Models\PaymentGateway;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('enforces unique gateway name', function () {
    $gateway = PaymentGateway::factory()->create(['name' => 'GatewayX']);

    expect(fn () => PaymentGateway::factory()->create(['name' => $gateway->name]))
        ->toThrow(QueryException::class);
});
