<?php

use App\Models\Booking;
use App\Models\PaymentGateway;
use App\Models\Transaction;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates booking and associated transaction with gateway', function () {
    $booking = Booking::factory()->create();
    $gateway = PaymentGateway::factory()->active()->create();

    $transaction = Transaction::factory()->state([
        'booking_id' => $booking->id,
        'gateway_type' => PaymentGateway::class,
        'gateway_id' => $gateway->id,
    ])->success()->create();

    $transaction->load('booking', 'gateway');

    expect($transaction->booking->id)->toBe($booking->id);
    expect($transaction->gateway)->toBeInstanceOf(PaymentGateway::class);
    expect($transaction->status)->toBe('success');
});

it('enforces unique transaction reference_number', function () {
    $txn = Transaction::factory()->create();

    expect(fn () => Transaction::factory()->create([
        'reference_number' => $txn->reference_number,
    ]))->toThrow(QueryException::class);
});

it('enforces unique booking_reference', function () {
    Booking::factory()->create(['booking_reference' => 'BK-UNIQ-001']);
    expect(fn () => Booking::factory()->create(['booking_reference' => 'BK-UNIQ-001']))
        ->toThrow(\Illuminate\Database\QueryException::class);
});
