<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company' => ['required'],
            'location' => ['nullable'],
            'salary' => ['nullable'],
            'dateApplied' => ['nullable'],
            'status' => ['required'],
            'note' => ['nullable'],
        ]);

        $request->user()->applications()->create([
            'company' => $validated['company'],
            'location' => $validated['location'] ?? null,
            'salary' => $validated['salary'] ?? null,
            'date_applied' => $validated['dateApplied'] ?? null,
            'status' => $validated['status'],
            'note' => $validated['note'] ?? null,
        ]);

        return back();
    }
}
