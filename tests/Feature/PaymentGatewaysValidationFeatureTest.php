<?php

use App\Http\Requests\PaymentGateways\StorePaymentGatewayRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

it('rejects invalid gateway payloads', function () {
    $payload = [
        'name' => str_repeat('x', 300),
        'config' => 'not-an-array',
        'is_active' => 'yes',
    ];

    $validator = Validator::make($payload, (new StorePaymentGatewayRequest)->rules());
    expect($validator->fails())->toBeTrue();
});

it('accepts minimal valid gateway payload', function () {
    $payload = [
        'name' => 'GatewayY',
    ];

    $validator = Validator::make($payload, (new StorePaymentGatewayRequest)->rules());
    expect($validator->fails())->toBeFalse();
});
