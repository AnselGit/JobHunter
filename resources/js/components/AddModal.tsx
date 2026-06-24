import React from 'react';

type NewApplication = {
    company: string;
    location: string;
    salary: string;
    dateApplied: string;
    status: string;
    note: string;
};

type AddModalProps = {
    open: boolean;
    onClose: () => void;

    newApplication: NewApplication;

    updateField: (
        field: keyof NewApplication,
        value: string
    ) => void;

    onSubmit: () => void;
};

export default function AddModal({
    open,
    onClose,
    newApplication,
    updateField,
    onSubmit,
}: AddModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            Add Application
                        </h2>

                        <p className="text-xs text-slate-500">
                            Track your next opportunity
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
                <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Company
                        </label>

                        <input
                            value={newApplication.company}
                            onChange={(e) =>
                                updateField('company', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Location
                            </label>

                            <input
                                value={newApplication.location}
                                onChange={(e) =>
                                    updateField('location', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Salary
                            </label>

                            <input
                                value={newApplication.salary}
                                onChange={(e) =>
                                    updateField('salary', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Applied
                            </label>

                            <input
                                type="date"
                                value={newApplication.dateApplied}
                                onChange={(e) =>
                                    updateField(
                                        'dateApplied',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Status
                            </label>
                            <select
                                value={newApplication.status}
                                onChange={(e) =>
                                    updateField('status', e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-200
                                    px-3
                                    py-2.5
                                    bg-white
                                    text-slate-700
                                    focus:ring-2
                                    focus:ring-sky-500
                                    focus:border-sky-500
                                    outline-none
                                "
                            >
                                <option value="applied">Applied</option>
                                <option value="interview">Interview</option>
                                <option value="offer">Offer</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Notes
                        </label>

                        <textarea
                            rows={3}
                            value={newApplication.note}
                            onChange={(e) =>
                                updateField('note', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 resize-none"
                        />
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
                        onClick={onSubmit}
                        className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition"
                    >
                        Add
                    </button>

                </div>

            </div>
        </div>
    );
}