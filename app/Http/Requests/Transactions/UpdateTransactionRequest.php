<?php

namespace App\Http\Requests\Transactions;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransactionRequest extends FormRequest
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
            'amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', Rule::in(['pending', 'success', 'failed'])],
            'payment_method' => ['nullable', 'string', 'max:64'],
            'reference_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('transactions', 'reference_number')->ignore($this->route('transaction'))],
            'booking_id' => ['sometimes', 'required', 'integer', 'exists:bookings,id'],
            'gateway_type' => ['nullable', 'string'],
            'gateway_id' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
