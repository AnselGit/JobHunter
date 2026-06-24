import type { Application } from '@/types/application';

type Props = {
    open: boolean;

    batchType: string;

    applications: Application[];

    isDeleting: boolean;

    onClose: () => void;
    onConfirm: () => void;
};

export default function BatchDeleteModal({
    open,
    batchType,
    applications,
    isDeleting,
    onClose,
    onConfirm,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

                    <div>
                        <h2 className="text-lg font-semibold text-red-600">
                            Batch Delete
                        </h2>

                        <p className="text-xs text-slate-500">
                            You are about to delete {applications.length} application(s)
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
                    >
                        ✕
                    </button>

                </div>

                {/* Body */}
                <div className="p-5 flex-1 overflow-y-auto">

                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">

                        <div className="font-medium text-red-700">
                            Delete {batchType}
                        </div>

                        <div className="mt-1 text-sm text-red-600">
                            This action cannot be undone.
                        </div>

                    </div>

                    <div className="mb-3 text-sm text-slate-600">
                        Applications to be deleted:
                    </div>

                    <div className="space-y-2">

                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="rounded-xl border border-slate-200 px-3 py-3"
                            >
                                <div className="font-medium text-slate-800">
                                    {app.company}
                                </div>

                                <div className="text-xs text-slate-500">
                                    {app.location}
                                </div>

                                <div className="mt-1 text-xs text-slate-400">
                                    {app.status}
                                </div>
                            </div>
                        ))}

                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">

                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                    >
                        {isDeleting
                            ? 'Deleting...'
                            : `Delete ${applications.length}`}
                    </button>

                </div>

            </div>
        </div>
    );
}