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
    onCheckVerification,
    onResend,
    onResetPassword,
}: Props) {
    if (!open) return null;

    const minutes = Math.floor(
        expiryCountdown / 60
    );

    const seconds =
        expiryCountdown % 60;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

                {/* EMAIL STEP */}

                {forgotStep === 'email' && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">
                            Forgot Password
                        </h2>

                        <p className="text-sm text-slate-500 mb-4">
                            Enter your email address.
                        </p>

                        <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) =>
                                setForgotEmail(
                                    e.target.value
                                )
                            }
                            placeholder="Email Address"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                            "
                        />

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="
                                    rounded-xl
                                    border
                                    px-4
                                    py-2
                                "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    onSendVerification
                                }
                                className="
                                    rounded-xl
                                    bg-sky-500
                                    px-4
                                    py-2
                                    text-white
                                "
                            >
                                Send Email
                            </button>
                        </div>
                    </>
                )}

                {/* WAITING STEP */}

                {forgotStep === 'waiting' && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">
                            Verification Sent
                        </h2>

                        <p className="text-sm text-slate-500 mb-2">
                            {forgotEmail}
                        </p>

                        <div className="mb-4 text-center text-lg font-semibold text-sky-600">
                            {minutes}:
                            {seconds
                                .toString()
                                .padStart(2, '0')}
                        </div>

                        <p className="text-center text-sm text-slate-500 mb-6">
                            Waiting for email
                            verification...
                        </p>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={
                                    onCheckVerification
                                }
                                className="
                                    rounded-xl
                                    bg-sky-500
                                    py-3
                                    text-white
                                "
                            >
                                I've Verified My Email
                            </button>

                            <button
                                disabled={
                                    resendCooldown > 0
                                }
                                onClick={onResend}
                                className="
                                    rounded-xl
                                    border
                                    py-3
                                "
                            >
                                {resendCooldown > 0
                                    ? `Resend (${resendCooldown}s)`
                                    : 'Resend Email'}
                            </button>
                        </div>
                    </>
                )}

                {/* RESET STEP */}

                {forgotStep === 'reset' && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">
                            Reset Password
                        </h2>

                        <p className="text-sm text-green-600 mb-4">
                            Email verified successfully.
                        </p>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            placeholder="New Password"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                mb-3
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
                            "
                        />

                        <button
                            onClick={
                                onResetPassword
                            }
                            className="
                                mt-5
                                w-full
                                rounded-xl
                                bg-sky-500
                                py-3
                                text-white
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