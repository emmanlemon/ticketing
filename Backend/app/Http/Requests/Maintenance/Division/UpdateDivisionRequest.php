<?php

namespace App\Http\Requests\Maintenance\Division;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDivisionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'division_description' => 'required',
            'b_active' => 'required',
        ];
    }

    public function getDivisionData(): array
    {
        return [
            'b_active' => $this->b_active,
            'division_description' => $this->division_description,
        ];
    }
}
