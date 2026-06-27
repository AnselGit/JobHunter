type Props = {
    open: boolean;

    forgotStep: 'email' | 'waiting' | 'reset';

    forgotEmail: string;
    setForgotEmail: (value: string) => void;

    expiryCountdown: number;
    resendCooldown: number;

    newPassword: string;
    setNewPassword: (value: string) => void;

    confirmNewPassword: string;
    setConfirmNewPassword: (value: string) => void;

    onClose: () => void;

    onSendVerification: () => void;
    onCheckVerification: () => void;
    onResend: () => void;
    onResetPassword: () => void;
};

export default function ForgotPasswordModal({
    open,

    forgotStep,

    forgotEmail,
    setForgotEmail,

    expiryCountdown,
    resendCooldown,

    newPassword,
    setNewPassword,

    confirmNewPassword,
    setConfirmNewPassword,

    onClose,

    onSendVerification,
    onResend,
    onResetPassword,
}: Props) {
    if (!open) return null;

    const minutes = Math.floor(expiryCountdown / 60);
    const seconds = expiryCountdown % 60;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
                >
                    ✕
                </button>

                {forgotStep === 'email' && (
                    <>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Forgot Password
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Enter the email address associated with your account.
                        </p>

                        <div className="mt-5">
                            <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) =>
                                    setForgotEmail(e.target.value)
                                }
                                placeholder="Email Address"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    outline-none
                                    focus:border-sky-500
                                "
                            />
                        </div>

                        <button
                            onClick={onSendVerification}
                            className="
                                mt-5
                                w-full
                                rounded-xl
                                bg-sky-500
                                py-3
                                font-medium
                                text-white
                                transition-all
                                hover:bg-sky-600
                            "
                        >
                            Send Verification Email
                        </button>
                    </>
                )}

                {forgotStep === 'waiting' && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Verification Sent
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            A verification link has been sent to
                        </p>

                        <p className="mt-1 break-all font-medium text-slate-700">
                            {forgotEmail}
                        </p>

                        <div className="mt-6">
                            <div className="text-3xl font-bold text-sky-600">
                                {minutes}:
                                {seconds
                                    .toString()
                                    .padStart(2, '0')}
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                Link expires in 5 minutes
                            </p>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
                        </div>

                        <p className="mt-4 text-sm text-slate-500">
                            Waiting for verification...
                        </p>

                        <button
                            disabled={resendCooldown > 0}
                            onClick={onResend}
                            className="
                                mt-6
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                py-3
                                font-medium
                                transition-all
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {resendCooldown > 0
                                ? `Resend Email (${resendCooldown}s)`
                                : 'Resend Email'}
                        </button>
                    </div>
                )}

                {forgotStep === 'reset' && (
                    <>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Reset Password
                        </h2>

                        <p className="mt-2 text-sm text-green-600">
                            ✓ Email verified successfully
                        </p>

                        <div className="mt-5 space-y-3">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="New Password"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    outline-none
                                    focus:border-sky-500
                                "
                            />

                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                    setConfirmNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm Password"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    outline-none
                                    focus:border-sky-500
                                "
                            />
                        </div>

                        <button
                            onClick={onResetPassword}
                            className="
                                mt-5
                                w-full
                                rounded-xl
                                bg-sky-500
                                py-3
                                font-medium
                                text-white
                                transition-all
                                hover:bg-sky-600
                            "
                        >
                            Change Password
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}