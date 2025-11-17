<?php

namespace App\Http\Requests\Packages;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePackageRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:hajj,umrah'],
            'duration_days' => ['required', 'integer', 'min:1', 'max:365'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'departure_date' => ['required', 'date'],
            'return_date' => ['required', 'date', 'after_or_equal:departure_date'],
            'available_slots' => ['required', 'integer', 'min:0'],
            'is_featured' => ['sometimes', 'boolean'],

            'media' => ['array'],
            'media.*.file' => ['required', 'file', 'mimetypes:image/*,video/*', 'max:5120'],
            'media.*.type' => ['required', 'in:image,video'],
            'media.*.alt_text' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Type must be either hajj or umrah.',
            'return_date.after_or_equal' => 'Return date must be after or equal to departure date.',
            'media.*.file.mimetypes' => 'Media file must be an image or video.',
            'media.*.file.max' => 'Media file size must not exceed 5MB.',
        ];
    }
}
