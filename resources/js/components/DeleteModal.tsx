import type { Application } from '@/types/application';

type Props = {
    open: boolean;

    deleteTarget: Application | null;

    onClose: () => void;

    onDelete: () => void;
};

export default function DeleteModal({
    open,
    deleteTarget,
    onClose,
    onDelete,
}: Props) {
    if (!open || !deleteTarget) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-modalIn">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-semibold text-red-600">
                            Delete Application
                        </h2>

                        <p className="text-xs text-slate-500">
                            This action cannot be undone
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3 text-sm">

                    <p className="text-slate-600">
                        You are about to permanently delete this application:
                    </p>

                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-1 text-slate-700">
                        <p>
                            <span className="font-medium">Company:</span>{' '}
                            {deleteTarget.company}
                        </p>

                        <p>
                            <span className="font-medium">Location:</span>{' '}
                            {deleteTarget.location}
                        </p>

                        <p>
                            <span className="font-medium">Salary:</span>{' '}
                            {deleteTarget.salary}
                        </p>

                        <p>
                            <span className="font-medium">Status:</span>{' '}
                            {deleteTarget.status}
                        </p>

                        <p>
                            <span className="font-medium">Applied:</span>{' '}
                            {deleteTarget.dateApplied}
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
}