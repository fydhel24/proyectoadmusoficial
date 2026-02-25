<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'ci',
        'area',
        'phone',
        'cv',
        'extra_documents',
        'status',
    ];

    protected $casts = [
        'extra_documents' => 'array',
    ];
}