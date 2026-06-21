<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Application;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return Inertia::render('track', [
        'auth' => Auth::user(),

        'applications' => Auth::check()
            ? Application::where('user_id', Auth::id())
                ->latest()
                ->get()
            : [],
    ]);
});

// Auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);