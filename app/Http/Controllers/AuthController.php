<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PasswordResetVerification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return back()->withErrors([
                'email' => 'Invalid credentials.',
            ]);
        }

        $request->session()->regenerate();

        return redirect('/');
    }

    // Register
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:6'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], // automatically hashed by User model cast
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/');
    }

    // Logout
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function sendResetVerification(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where(
            'email',
            $request->email
        )->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => 'Email not found.',
            ]);
        }

        PasswordResetVerification::where(
            'email',
            $request->email
        )->delete();

        $token = Str::random(64);

        PasswordResetVerification::create([
            'email' => $request->email,
            'token' => $token,
            'expires_at' => now()->addMinutes(5),
        ]);

        $url = url(
            "/forgot-password/verify/{$token}"
        );

        Mail::html(
            "
            <h2>Password Reset Verification</h2>

            <p>Click the button below to verify your email.</p>

            <a href='{$url}'
            style='
                display:inline-block;
                padding:12px 20px;
                background:#0ea5e9;
                color:white;
                text-decoration:none;
                border-radius:8px;
            '>
                Verify Email
            </a>

            <p>
                This link expires in 5 minutes.
            </p>
            ",
            function ($message) use ($request) {
                $message
                    ->to($request->email)
                    ->subject(
                        'JobHunter Password Reset'
                    );
            }
        );

        return back()->with([
            'success' => 'Verification email sent.',
        ]);
    }

    public function verifyResetToken($token)
    {
        $verification =
            PasswordResetVerification::where(
                'token',
                $token
            )->first();

        if (
            !$verification ||
            now()->greaterThan(
                $verification->expires_at
            )
        ) {
            return 'Verification link expired.';
        }

        $verification->update([
            'verified_at' => now(),
        ]);

        return '
            <h2>Email Verified</h2>
            <p>You may now return to JobHunter and reset your password.</p>
        ';
    }

    public function checkResetStatus(Request $request)
    {
        $verification =
            PasswordResetVerification::where(
                'email',
                $request->email
            )->latest()
            ->first();

        return response()->json([
            'verified' =>
                $verification &&
                $verification->verified_at !== null,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:6'],
        ]);

        $verification =
            PasswordResetVerification::where(
                'email',
                $request->email
            )
            ->latest()
            ->first();

        if (
            !$verification ||
            !$verification->verified_at
        ) {
            return response()->json([
                'message' => 'Email not verified.',
            ], 403);
        }

        User::where(
            'email',
            $request->email
        )->update([
            'password' => Hash::make(
                $request->password
            ),
        ]);

        $verification->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}