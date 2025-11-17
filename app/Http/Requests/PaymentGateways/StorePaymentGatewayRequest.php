<?php

namespace App\Http\Requests\PaymentGateways;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentGatewayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('payment_gateways', 'name')],
            'is_active' => ['sometimes', 'boolean'],
            'config' => ['nullable', 'array'],
            'config.server_key' => ['nullable', 'string'],
            'config.client_key' => ['nullable', 'string'],
            'config.is_production' => ['nullable', 'boolean'],
            'config.is_sanitized' => ['nullable', 'boolean'],
            'config.is_3ds' => ['nullable', 'boolean'],
        ];
    }
}
