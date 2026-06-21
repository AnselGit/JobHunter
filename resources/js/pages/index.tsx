import { Head, router } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

type Status = 'applied' | 'interviewing' | 'offer' | 'rejected';

interface JobApplication {
    id: number;
    company: string;
    role: string;
    status: Status;
    date: string; // YYYY-MM-DD
}

interface Props {
    applications: JobApplication[];
}

type EditableFields = Pick<JobApplication, 'company' | 'role' | 'status' | 'date'>;

const STATUS_OPTIONS: Status[] = ['applied', 'interviewing', 'offer', 'rejected'];

const STATUS_STYLES: Record<Status, string> = {
    applied: 'bg-blue-100 text-blue-700',
    interviewing: 'bg-amber-100 text-amber-700',
    offer: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

export default function JobApplicationsIndex({ applications }: Props) {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row: JobApplication } | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<EditableFields | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'edit' | 'delete'; row: JobApplication } | null>(null);
    const [addOpen, setAddOpen] = useState(false);

    // Close the context menu on any outside click or scroll.
    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener('click', close);
        window.addEventListener('scroll', close, true);
        return () => {
            window.removeEventListener('click', close);
            window.removeEventListener('scroll', close, true);
        };
    }, []);

    function openContextMenu(e: React.MouseEvent, row: JobApplication) {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, row });
    }

    function startEdit(row: JobApplication) {
        setEditingId(row.id);
        setEditValues({ company: row.company, role: row.role, status: row.status, date: row.date });
        setContextMenu(null);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValues(null);
    }

    function requestSaveEdit(row: JobApplication) {
        setConfirmAction({ type: 'edit', row });
    }

    function requestDelete(row: JobApplication) {
        setConfirmAction({ type: 'delete', row });
        setContextMenu(null);
    }

    function runConfirmedAction() {
        if (!confirmAction) return;

        if (confirmAction.type === 'delete') {
            router.delete(`/applications/${confirmAction.row.id}`, {
                onFinish: () => setConfirmAction(null),
            });
            return;
        }

        if (confirmAction.type === 'edit' && editValues) {
            router.put(`/applications/${confirmAction.row.id}`, editValues, {
                onSuccess: () => {
                    setEditingId(null);
                    setEditValues(null);
                },
                onFinish: () => setConfirmAction(null),
            });
        }
    }

    return (
        <>
            <Head title="Job Applications" />

            <div className="p-6">
                <div className="mb-1 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900">Job Applications</h1>
                    <button
                        onClick={() => setAddOpen(true)}
                        className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
                    >
                        + Add Application
                    </button>
                </div>
                <p className="mb-4 text-sm text-gray-500">Right-click a row to edit or delete it.</p>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-4 py-3">Company</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((row) => {
                                const isEditing = editingId === row.id;
                                return (
                                    <tr
                                        key={row.id}
                                        onContextMenu={(e) => openContextMenu(e, row)}
                                        className="border-t border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2">
                                            {isEditing ? (
                                                <input
                                                    autoFocus
                                                    className="w-full rounded border border-gray-300 px-2 py-1 focus:border-sky-400 focus:outline-none"
                                                    value={editValues?.company ?? ''}
                                                    onChange={(e) =>
                                                        setEditValues((v) => v && { ...v, company: e.target.value })
                                                    }
                                                />
                                            ) : (
                                                row.company
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {isEditing ? (
                                                <input
                                                    className="w-full rounded border border-gray-300 px-2 py-1 focus:border-sky-400 focus:outline-none"
                                                    value={editValues?.role ?? ''}
                                                    onChange={(e) =>
                                                        setEditValues((v) => v && { ...v, role: e.target.value })
                                                    }
                                                />
                                            ) : (
                                                row.role
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {isEditing ? (
                                                <select
                                                    className="w-full rounded border border-gray-300 px-2 py-1 focus:border-sky-400 focus:outline-none"
                                                    value={editValues?.status ?? 'applied'}
                                                    onChange={(e) =>
                                                        setEditValues((v) => v && { ...v, status: e.target.value as Status })
                                                    }
                                                >
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <option key={s} value={s}>
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${STATUS_STYLES[row.status]}`}>
                                                    {row.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    className="w-full rounded border border-gray-300 px-2 py-1 focus:border-sky-400 focus:outline-none"
                                                    value={editValues?.date ?? ''}
                                                    onChange={(e) =>
                                                        setEditValues((v) => v && { ...v, date: e.target.value })
                                                    }
                                                />
                                            ) : (
                                                row.date
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {isEditing && (
                                                <>
                                                    <button
                                                        onClick={() => requestSaveEdit(row)}
                                                        className="mr-3 text-sm font-medium text-sky-600 hover:underline"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-sm font-medium text-gray-500 hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                                        No job applications yet. Click "Add Application" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right-click context menu */}
            {contextMenu && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className="animate-fadeIn fixed z-50 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => startEdit(contextMenu.row)}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => requestDelete(contextMenu.row)}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                    >
                        Delete
                    </button>
                </div>
            )}

            {/* Confirmation dialog, shared by edit-save and delete */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="animate-modalIn w-80 rounded-lg bg-white p-5 shadow-xl">
                        <h2 className="mb-2 text-base font-semibold text-gray-900">
                            {confirmAction.type === 'delete' ? 'Delete application?' : 'Save changes?'}
                        </h2>
                        <p className="mb-4 text-sm text-gray-500">
                            {confirmAction.type === 'delete'
                                ? `This will permanently remove ${confirmAction.row.company} from your list.`
                                : `Confirm the changes to ${confirmAction.row.company}.`}
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={runConfirmedAction}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium text-white ${
                                    confirmAction.type === 'delete'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-sky-500 hover:bg-sky-600'
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add modal */}
            {addOpen && <AddApplicationModal onClose={() => setAddOpen(false)} />}
        </>
    );
}

function AddApplicationModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<EditableFields>({ company: '', role: '', status: 'applied', date: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        router.post('/applications', form, {
            onSuccess: () => onClose(),
            onError: (errs) => setErrors(errs as Record<string, string>),
            onFinish: () => setSubmitting(false),
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form onSubmit={handleSubmit} className="animate-modalIn w-96 rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-base font-semibold text-gray-900">Add Job Application</h2>

                <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
                <input
                    autoFocus
                    className="mb-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
                {errors.company && <p className="mb-2 text-xs text-red-600">{errors.company}</p>}

                <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                <input
                    className="mb-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                {errors.role && <p className="mb-2 text-xs text-red-600">{errors.role}</p>}

                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <select
                    className="mb-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    className="mb-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                {errors.date && <p className="mb-2 text-xs text-red-600">{errors.date}</p>}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
                    >
                        {submitting ? 'Saving…' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    );
}
