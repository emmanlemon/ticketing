<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['department_id' , 'division_id','department_description' , 'b_active'];

    public function section()
    {
        return $this->hasMany(Section::class , 'department_id');
    }

    public function division()
    {
        return $this->belongsTo(Division::class , 'division_id' , 'id');
    }
}
