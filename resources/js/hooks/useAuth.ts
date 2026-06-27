import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export function useAuth() {
    const [authMode, setAuthMode] =
        useState<'login' | 'register'>('login');

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [authError, setAuthError] =
        useState('');

    const [authForm, setAuthForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showForgotModal, setShowForgotModal] =
        useState(false);

    const [forgotStep, setForgotStep] =
        useState<'email' | 'waiting' | 'reset'>(
            'email'
        );

    const [forgotEmail, setForgotEmail] =
        useState('');

    const [emailVerified, setEmailVerified] =
        useState(false);

    const [resendCooldown, setResendCooldown] =
        useState(0);

    const [expiryCountdown, setExpiryCountdown] =
        useState(300);

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmNewPassword, setConfirmNewPassword] =
        useState('');

    useEffect(() => {
        if (
            forgotStep !== 'waiting' ||
            expiryCountdown <= 0
        ) {
            return;
        }

        const timer = setTimeout(() => {
            setExpiryCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [forgotStep, expiryCountdown]);

    useEffect(() => {
        if (resendCooldown <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendCooldown]);

    useEffect(() => {
        if (
            forgotStep !== 'waiting' ||
            !forgotEmail ||
            expiryCountdown <= 0
        ) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                const response = await fetch(
                    '/forgot-password/status',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json',

                            'X-CSRF-TOKEN':
                                (
                                    document.querySelector(
                                        'meta[name="csrf-token"]'
                                    ) as HTMLMetaElement
                                )?.content,
                        },

                        body: JSON.stringify({
                            email: forgotEmail,
                        }),
                    }
                );

                const data =
                    await response.json();

                if (data.verified) {
                    setEmailVerified(true);
                    setForgotStep('reset');
                }
            } catch (error) {
                console.error(
                    'Verification check failed:',
                    error
                );
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [
        forgotStep,
        forgotEmail,
        expiryCountdown,
    ]);

    useEffect(() => {
        if (resendCooldown <= 0) return;

        const timer = setTimeout(() => {
            setResendCooldown((v) => v - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const resetAuthForm = () => {
        setAuthForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });

        setAuthError('');
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleAuthSubmit = () => {
        setAuthError('');

        if (!authForm.email.trim()) {
            setAuthError('Email is required.');
            return;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(authForm.email)) {
            setAuthError(
                'Please enter a valid email address.'
            );
            return;
        }

        if (!authForm.password.trim()) {
            setAuthError('Password is required.');
            return;
        }

        if (authForm.password.length < 6) {
            setAuthError(
                'Password must be at least 6 characters.'
            );
            return;
        }

        if (authMode === 'register') {
            if (!authForm.name.trim()) {
                setAuthError(
                    'Full name is required.'
                );
                return;
            }

            if (
                !authForm.confirmPassword.trim()
            ) {
                setAuthError(
                    'Please confirm your password.'
                );
                return;
            }

            if (
                authForm.password !==
                authForm.confirmPassword
            ) {
                setAuthError(
                    'Passwords do not match.'
                );
                return;
            }

            router.post(
                '/register',
                {
                    name: authForm.name,
                    email: authForm.email,
                    password: authForm.password,
                    password_confirmation:
                        authForm.confirmPassword,
                },
                {
                    preserveScroll: true,
                    onSuccess: resetAuthForm,
                    onError: (errors) => {
                        const firstError =
                            Object.values(errors)[0];

                        if (firstError) {
                            setAuthError(
                                String(firstError)
                            );
                        }
                    },
                }
            );

            return;
        }

        router.post(
            '/login',
            {
                email: authForm.email,
                password: authForm.password,
            },
            {
                preserveScroll: true,
                onSuccess: resetAuthForm,
                onError: (errors) => {
                    const firstError =
                        Object.values(errors)[0];

                    if (firstError) {
                        setAuthError(
                            String(firstError)
                        );
                    }
                },
            }
        );
    };

    const resetForgotPassword = () => {
        setShowForgotModal(false);

        setForgotStep('email');

        setForgotEmail('');

        setEmailVerified(false);

        setResendCooldown(0);

        setExpiryCountdown(300);

        setNewPassword('');

        setConfirmNewPassword('');
    };

    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs
            .toString()
            .padStart(2, '0')}`;
    };

    return {
        authMode,
        setAuthMode,

        authForm,
        setAuthForm,

        authError,

        showPassword,
        setShowPassword,

        showConfirmPassword,
        setShowConfirmPassword,

        resetAuthForm,
        handleAuthSubmit,

        showForgotModal,
        setShowForgotModal,

        forgotStep,
        setForgotStep,

        forgotEmail,
        setForgotEmail,

        emailVerified,
        setEmailVerified,

        resendCooldown,
        setResendCooldown,

        expiryCountdown,
        setExpiryCountdown,

        newPassword,
        setNewPassword,

        confirmNewPassword,
        setConfirmNewPassword,

        resetForgotPassword,
        formatCountdown,
    };
}