<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobApplicationController extends Controller
{
    /**
     * Display the job applications table.
     */
    public function index(): Response
    {
        $applications = JobApplication::where('user_id', auth()->id())
            ->orderByDesc('date')
            ->get();

        return Inertia::render('job-applications/index', [
            'applications' => $applications,
        ]);
    }

    /**
     * Store a new job application (used by the "Add" modal).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:applied,interviewing,offer,rejected'],
            'date' => ['required', 'date'],
        ]);

        $request->user()->jobApplications()->create($validated);

        return back();
    }

    /**
     * Update an existing job application (used by inline row editing).
     */
    public function update(Request $request, JobApplication $jobApplication): RedirectResponse
    {
        abort_unless($jobApplication->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'company' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:applied,interviewing,offer,rejected'],
            'date' => ['required', 'date'],
        ]);

        $jobApplication->update($validated);

        return back();
    }

    /**
     * Delete a job application (used by the right-click "Delete" option).
     */
    public function destroy(Request $request, JobApplication $jobApplication): RedirectResponse
    {
        abort_unless($jobApplication->user_id === $request->user()->id, 403);

        $jobApplication->delete();

        return back();
    }
}
