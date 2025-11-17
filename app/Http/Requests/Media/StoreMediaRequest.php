<?php

namespace App\Http\Requests\Media;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
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
            'mediable_type' => ['required', 'string'],
            'mediable_id' => ['required', 'integer', 'min:1'],
            'type' => ['required', 'in:image,video'],
            'path' => ['nullable', 'string'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'ordering' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
