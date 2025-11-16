<?php

use App\Http\Requests\Media\StoreMediaRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

dataset('invalidMediaNumeric', [
    ['size', -1],
    ['ordering', -5],
]);

it('rejects negative media numeric values', function (string $key, int $value) {
    $payload = [
        'mediable_type' => \App\Models\Package::class,
        'mediable_id' => \App\Models\Package::factory()->create()->id,
        'type' => 'image',
        'path' => 'uploads/example.jpg',
        $key => $value,
    ];

    $validator = Validator::make($payload, (new StoreMediaRequest)->rules());
    expect($validator->fails())->toBeTrue();
})->with('invalidMediaNumeric');

it('rejects missing path', function () {
    $payload = [
        'mediable_type' => \App\Models\Package::class,
        'mediable_id' => \App\Models\Package::factory()->create()->id,
        'type' => 'image',
    ];
    $validator = Validator::make($payload, (new StoreMediaRequest)->rules());
    expect($validator->fails())->toBeTrue();
});
