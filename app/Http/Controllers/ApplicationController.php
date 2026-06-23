<?php

namespace App\Http\Controllers;

use App\Models\Application;
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

        $application = $request->user()->applications()->create([
            'company' => $validated['company'],
            'location' => $validated['location'] ?? null,
            'salary' => $validated['salary'] ?? null,
            'date_applied' => $validated['dateApplied'] ?? null,
            'status' => strtolower($validated['status']),
            'note' => $validated['note'] ?? null,
        ]);
        return back();
    }

    public function update(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        $application->update([
            'company' => $request->company,
            'location' => $request->location,
            'salary' => $request->salary,

            'date_applied' => $request->date_applied ?? $request->dateApplied,

            'status' => strtolower($request->status),

            'note' => $request->note,
        ]);

        return back();
    }

    public function destroy($id)
    {
        $application = Application::findOrFail($id);
        $application->delete();

        return back();
    }
}