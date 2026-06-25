import { useState } from 'react';
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
    };
}