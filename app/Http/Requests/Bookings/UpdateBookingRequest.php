<?php

namespace App\Http\Requests\Bookings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookingRequest extends FormRequest
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
            'booking_reference' => ['nullable', 'string', 'max:64', Rule::unique('bookings', 'booking_reference')->ignore($this->route('booking'))],
            'status' => ['sometimes', 'required', 'string', 'max:32'],
            'notes' => ['nullable', 'string'],
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'package_id' => ['sometimes', 'required', 'integer', 'exists:packages,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'booking_reference.unique' => 'Booking reference must be unique.',
        ];
    }
}
