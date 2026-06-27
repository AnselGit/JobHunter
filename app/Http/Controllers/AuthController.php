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
            <div style='
                margin:0;
                padding:40px 20px;
                background:#f1f5f9;
                font-family:Segoe UI,Arial,sans-serif;
            '>

                <table
                    align='center'
                    cellpadding='0'
                    cellspacing='0'
                    width='100%'
                    style='max-width:600px;'
                >
                    <tr>
                        <td
                            style='
                                background:#ffffff;
                                border-radius:20px;
                                padding:48px;
                                box-shadow:0 10px 35px rgba(15,23,42,.08);
                                text-align:center;
                            '
                        >

                            <div
                                style='
                                    width:80px;
                                    height:80px;
                                    margin:0 auto 28px;
                                    border-radius:50%;
                                    background:#e0f2fe;
                                    font-size:38px;
                                    line-height:80px;
                                '
                            >
                                🔒
                            </div>

                            <h1
                                style='
                                    margin:0;
                                    color:#0f172a;
                                    font-size:30px;
                                    font-weight:700;
                                '
                            >
                                Password Reset
                            </h1>

                            <p
                                style='
                                    margin:22px 0;
                                    color:#64748b;
                                    font-size:16px;
                                    line-height:28px;
                                '
                            >
                                We received a request to reset the password for your
                                <strong>JobHunter</strong> account.
                                <br><br>
                                Click the button below to verify your email before
                                creating a new password.
                            </p>

                            <a
                                href='{$url}'
                                style='
                                    display:inline-block;
                                    background:#38bdf8;
                                    color:#ffffff;
                                    text-decoration:none;
                                    font-weight:600;
                                    padding:16px 34px;
                                    border-radius:12px;
                                    font-size:16px;
                                '
                            >
                                Verify Email
                            </a>

                            <div
                                style='
                                    margin-top:35px;
                                    padding:18px;
                                    border-radius:12px;
                                    background:#f8fafc;
                                    color:#475569;
                                    font-size:14px;
                                    line-height:24px;
                                '
                            >
                                <strong>This verification link expires in 5 minutes.</strong>
                                <br>
                                For your security, it can only be used once.
                            </div>

                            <hr
                                style='
                                    margin:36px 0;
                                    border:none;
                                    border-top:1px solid #e2e8f0;
                                '
                            >

                            <p
                                style='
                                    margin:0;
                                    color:#94a3b8;
                                    font-size:13px;
                                    line-height:22px;
                                '
                            >
                                If you didn't request a password reset,
                                you can safely ignore this email.
                                Your password will remain unchanged.
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td
                            style='
                                padding:24px;
                                text-align:center;
                                color:#94a3b8;
                                font-size:13px;
                            '
                        >
                            © " . date('Y') . " JobHunter
                            <br>
                            Helping you track every application.
                        </td>
                    </tr>

                </table>

            </div>
            ",
            function ($message) use ($request) {
                $message
                    ->to($request->email)
                    ->subject('JobHunter Password Reset');
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
            return '
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Link Expired</title>
            </head>
            <body style="
                margin:0;
                background:#f1f5f9;
                font-family:Segoe UI,Arial,sans-serif;
                padding:40px 20px;
            ">

                <table
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width:600px;"
                >
                    <tr>
                        <td style="
                            background:#ffffff;
                            border-radius:20px;
                            padding:48px;
                            text-align:center;
                            box-shadow:0 10px 35px rgba(15,23,42,.08);
                        ">

                            <div style="
                                width:80px;
                                height:80px;
                                margin:0 auto 28px;
                                border-radius:50%;
                                background:#fee2e2;
                                line-height:80px;
                                font-size:40px;
                            ">
                                ❌
                            </div>

                            <h1 style="
                                margin:0;
                                color:#dc2626;
                                font-size:30px;
                            ">
                                Verification Link Expired
                            </h1>

                            <p style="
                                margin:22px 0;
                                color:#64748b;
                                font-size:16px;
                                line-height:28px;
                            ">
                                This password reset verification link
                                has expired or is no longer valid.
                            </p>

                            <div style="
                                margin-top:30px;
                                padding:18px;
                                border-radius:12px;
                                background:#fef2f2;
                                color:#991b1b;
                                font-size:14px;
                                line-height:24px;
                            ">
                                Please return to JobHunter and request
                                a new password reset email.
                            </div>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
            ';
        }

        $verification->update([
            'verified_at' => now(),
        ]);

        return '
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Email Verified</title>
            </head>

            <body style="
                margin:0;
                background:#f1f5f9;
                font-family:Segoe UI,Arial,sans-serif;
                padding:40px 20px;
            ">

                <table
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width:600px;"
                >
                    <tr>
                        <td style="
                            background:#ffffff;
                            border-radius:20px;
                            padding:48px;
                            text-align:center;
                            box-shadow:0 10px 35px rgba(15,23,42,.08);
                        ">

                            <div style="
                                width:80px;
                                height:80px;
                                margin:0 auto 28px;
                                border-radius:50%;
                                background:#dcfce7;
                                line-height:80px;
                                font-size:40px;
                            ">
                                ✓
                            </div>

                            <h1 style="
                                margin:0;
                                color:#166534;
                                font-size:30px;
                                font-weight:700;
                            ">
                                Email Verified
                            </h1>

                            <p style="
                                margin:22px 0;
                                color:#64748b;
                                font-size:16px;
                                line-height:28px;
                            ">
                                Your email has been successfully verified.
                                <br><br>
                                You may now return to
                                <strong>JobHunter</strong>
                                and continue resetting your password.
                            </p>

                            <div style="
                                margin-top:30px;
                                padding:18px;
                                border-radius:12px;
                                background:#f0fdf4;
                                color:#166534;
                                font-size:14px;
                                line-height:24px;
                            ">
                                Verification complete.
                                <br>
                                You may now close this tab and return to the JobHunter application.
                            </div>

                        </td>
                    </tr>

                    <tr>
                        <td style="
                            padding:24px;
                            text-align:center;
                            color:#94a3b8;
                            font-size:13px;
                        ">
                            © ' . date('Y') . ' JobHunter
                            <br>
                            Helping you track every application.
                        </td>
                    </tr>

                </table>

            </body>
            </html>
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