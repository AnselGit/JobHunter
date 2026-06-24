<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Application;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicationController;


Route::get('/', function () {
    return Inertia::render('track', [
        'auth' => Auth::user(),

        'applications' => Auth::check()
            ? Application::where('user_id', Auth::id())
                ->latest()
                ->get()
                ->map(function ($a) {
                    return [
                        'id' => $a->id,
                        'company' => $a->company,
                        'location' => $a->location,
                        'salary' => $a->salary,
                        'dateApplied' => $a->date_applied,
                        'status' => $a->status,
                        'note' => $a->note,
                    ];
                })
            : [],
    ]);
});

// Auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

// Crud
Route::middleware('auth')->group(function () {
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::delete('/applications/batch', [ApplicationController::class, 'batchDestroy']);
    Route::patch('/applications/{id}', [ApplicationController::class, 'update']);
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy']);
});