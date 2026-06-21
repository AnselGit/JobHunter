<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Application extends Model
{
    protected $fillable = [
        'user_id',
        'company',
        'location',
        'salary',
        'date_applied',
        'status',
        'note',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}