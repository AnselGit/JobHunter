<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobApplicationController;

Route::inertia('/', 'track')->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('applications', [JobApplicationController::class, 'index'])->name('applications.index');
    Route::post('applications', [JobApplicationController::class, 'store'])->name('applications.store');
    Route::put('applications/{jobApplication}', [JobApplicationController::class, 'update'])->name('applications.update');
    Route::delete('applications/{jobApplication}', [JobApplicationController::class, 'destroy'])->name('applications.destroy');
});