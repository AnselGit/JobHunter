import type { Application } from '@/types/application';

type Props = {
    open: boolean;

    editForm: Application | null;
    setEditForm: (app: Application | null) => void;

    updateField: (field: keyof Application, value: string) => void;

    onClose: () => void;
    onSave: () => void;
    isSaving: boolean;
};

export default function EditModal({
    open,
    editForm,
    updateField,
    onClose,
    onSave,
    isSaving,
}: Props) {
    if (!open || !editForm) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

                {/* Header (same as AddModal) */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            Edit Application
                        </h2>

                        <p className="text-xs text-slate-500">
                            Update your application details
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
                        disabled={isSaving}
                    >
                        ✕
                    </button>
                </div>

                {/* Body (same layout style as AddModal) */}
                <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">

                    {/* Company */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Company
                        </label>
                        <input
                            value={editForm.company}
                            onChange={(e) => updateField('company', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                        />
                    </div>

                    {/* Location + Salary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Location
                            </label>
                            <input
                                value={editForm.location}
                                onChange={(e) => updateField('location', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Salary
                            </label>
                            <input
                                value={editForm.salary}
                                onChange={(e) => updateField('salary', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                            />
                        </div>
                    </div>

                    {/* Date + Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Applied
                            </label>
                            <input
                                type="date"
                                value={editForm.dateApplied}
                                onChange={(e) =>
                                    updateField('dateApplied', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Status
                            </label>
                            <select
                                value={editForm.status}
                                onChange={(e) =>
                                    updateField('status', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Notes
                        </label>
                        <textarea
                            rows={3}
                            value={editForm.note || ''}
                            onChange={(e) => updateField('note', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 resize-none"
                        />
                    </div>
                </div>

                {/* Footer (same style as AddModal) */}
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">

                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </div>
        </div>
    );
}