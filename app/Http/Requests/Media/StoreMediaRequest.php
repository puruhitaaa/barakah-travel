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
            'disk' => ['nullable', 'string', 'max:255'],
            'path' => ['required', 'string'],
            'mime_type' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'integer', 'min:0'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'ordering' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
