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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-modalIn">

                {/* Header */}
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Edit Application
                    </h2>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">

                    <input
                        value={editForm.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        placeholder="Company"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-300 outline-none"
                    />

                    <input
                        value={editForm.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="Location"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-300 outline-none"
                    />

                    <input
                        value={editForm.salary}
                        onChange={(e) => updateField('salary', e.target.value)}
                        placeholder="Salary"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-300 outline-none"
                    />

                    <input
                        type="date"
                        value={editForm.dateApplied}
                        onChange={(e) => updateField('dateApplied', e.target.value)}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-300 outline-none"
                    />

                    <select
                        value={editForm.status}
                        onChange={(e) => updateField('status', e.target.value)}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-300 outline-none"
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offer">Offer</option>
                    </select>

                    <textarea
                        value={editForm.note || ''}
                        onChange={(e) => updateField('note', e.target.value)}
                        placeholder="Notes"
                        className="w-full border rounded-xl px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-sky-300 outline-none"
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-60"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}