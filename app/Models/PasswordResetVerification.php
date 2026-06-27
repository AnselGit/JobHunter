<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetVerification extends Model
{
    protected $fillable = [
        'email',
        'token',
        'verified_at',
        'expires_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'expires_at' => 'datetime',
    ];
}