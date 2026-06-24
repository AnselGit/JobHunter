import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import type { Application } from '@/types/application';

type Toast = {
    type: 'success' | 'error';
    message: string;
} | null;

export function useApplications(applications: Application[]) {
    const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
    const [batchTargets, setBatchTargets] = useState<Application[]>([]);
    const [batchDeleteType, setBatchDeleteType] = useState<
        'all' | 'applied' | 'interview' | 'offer' | 'rejected'
    >('all');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    const [editForm, setEditForm] = useState<Application | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [query, setQuery] = useState('');

    const [sortBy, setSortBy] = useState<keyof Application | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const [toast, setToast] = useState<Toast>(null);

    const [newApplication, setNewApplication] = useState({
        company: '',
        location: '',
        salary: '',
        dateApplied: '',
        status: 'applied',
        note: '',
    });

    const itemsPerPage = 10;

    const parseSalary = (val?: string) => {
        if (!val) return 0;

        let s = String(val)
            .toLowerCase()
            .replace(/\$/g, '')
            .replace(/,/g, '')
            .trim();

        let multiplier = 1;

        if (s.endsWith('k')) {
            multiplier = 1000;
            s = s.slice(0, -1);
        } else if (s.endsWith('m')) {
            multiplier = 1_000_000;
            s = s.slice(0, -1);
        }

        const n = parseFloat(s);
        return isNaN(n) ? 0 : n * multiplier;
    };

    const filtered = useMemo(() => {
        let result = applications;

        if (query.trim()) {
            const q = query.toLowerCase();

            result = applications.filter((a) =>
                a.company.toLowerCase().includes(q) ||
                a.location.toLowerCase().includes(q) ||
                (a.note || '').toLowerCase().includes(q) ||
                a.status.toLowerCase().includes(q)
            );
        }

        if (sortBy) {
            result = [...result].sort((a, b) => {
                const av = (a as any)[sortBy];
                const bv = (b as any)[sortBy];

                let cmp = 0;

                if (sortBy === 'dateApplied') {
                    cmp = new Date(av).getTime() - new Date(bv).getTime();
                } else if (sortBy === 'salary') {
                    cmp = parseSalary(av) - parseSalary(bv);
                } else {
                    cmp = String(av || '').localeCompare(String(bv || ''));
                }

                return sortDir === 'asc' ? cmp : -cmp;
            });
        }

        return result;
    }, [applications, query, sortBy, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

    const paginated = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, page]);

    const startIndex =
        filtered.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;

    const endIndex = Math.min(page * itemsPerPage, filtered.length);

    useEffect(() => {
        setPage(1);
    }, [filtered]);

    const showToast = (t: Toast) => {
        setToast(t);

        if (t) {
            setTimeout(() => setToast(null), 2500);
        }
    };

    const handleSort = (key: keyof Application) => {
        if (sortBy === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortDir('asc');
        }

        setPage(1);
    };

    const updateNewApplicationField = (
        field: keyof typeof newApplication,
        value: string
    ) => {
        setNewApplication((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateEditField = (field: keyof Application, value: string) => {
        if (!editForm) return;

        setEditForm({
            ...editForm,
            [field]: value,
        });
    };

    const addApplication = () => {
        if (!newApplication.company.trim()) return;

        router.post('/applications', newApplication, {
            preserveScroll: true,

            onStart: () => setIsSaving(true),
            onFinish: () => setIsSaving(false),

            onSuccess: () => {
                setNewApplication({
                    company: '',
                    location: '',
                    salary: '',
                    dateApplied: '',
                    status: 'applied',
                    note: '',
                });

                setShowModal(false);

                showToast({
                    type: 'success',
                    message: 'Application added successfully',
                });
            },

            onError: () => {
                showToast({
                    type: 'error',
                    message: 'Failed to add application',
                });
            },
        });
    };

    const saveApplication = () => {
        if (!editForm) return;

        router.patch(
            `/applications/${editForm.id}`,
            {
                ...editForm,
                date_applied: editForm.dateApplied,
                status: editForm.status.toLowerCase(),
            },
            {
                preserveScroll: true,

                onStart: () => setIsSaving(true),
                onFinish: () => setIsSaving(false),

                onSuccess: () => {
                    setShowEditModal(false);
                    setEditForm(null);

                    showToast({
                        type: 'success',
                        message: 'Application updated successfully',
                    });
                },

                onError: () => {
                    showToast({
                        type: 'error',
                        message: 'Failed to update application',
                    });
                },
            }
        );
    };

    const deleteApplication = () => {
        if (!deleteTarget) return;

        router.delete(`/applications/${deleteTarget.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteTarget(null);

                showToast({
                    type: 'success',
                    message: 'Application deleted successfully',
                });
            },

            onError: () => {
                showToast({
                    type: 'error',
                    message: 'Failed to delete application',
                });
            },
        });
    };

    const openBatchDelete = (
        type: 'all' | 'applied' | 'interview' | 'offer' | 'rejected'
    ) => {
        const targets =
            type === 'all'
                ? applications
                : applications.filter(
                    (app) => app.status === type
                );

        if (targets.length === 0) {
            showToast({
                type: 'error',
                message: `No ${type} applications found`,
            });

            return;
        }

        setBatchDeleteType(type);
        setBatchTargets(targets);
        setShowBatchDeleteModal(true);
    };

    const deleteBatchApplications = () => {
        if (batchTargets.length === 0) return;

        router.delete('/applications/batch', {
            data: {
                ids: batchTargets.map((a) => a.id),
            },

            preserveScroll: true,

            onStart: () => setIsSaving(true),

            onFinish: () => setIsSaving(false),

            onSuccess: () => {
                setShowBatchDeleteModal(false);

                setBatchTargets([]);

                showToast({
                    type: 'success',
                    message: `${batchTargets.length} applications deleted`,
                });
            },

            onError: () => {
                showToast({
                    type: 'error',
                    message: 'Batch delete failed',
                });
            },
        });
    };

    return {
        deleteBatchApplications,
        
        showBatchDeleteModal,
        setShowBatchDeleteModal,

        batchDeleteType,
        setBatchDeleteType,

        batchTargets,
        setBatchTargets,

        openBatchDelete,

        showDeleteModal,
        setShowDeleteModal,

        deleteTarget,
        setDeleteTarget,

        isSaving,
        setIsSaving,

        editForm,
        setEditForm,

        showEditModal,
        setShowEditModal,

        query,
        setQuery,

        sortBy,
        sortDir,

        page,
        setPage,

        showModal,
        setShowModal,

        newApplication,

        filtered,
        paginated,

        totalPages,
        startIndex,
        endIndex,

        toast,
        setToast,

        handleSort,

        addApplication,
        saveApplication,
        deleteApplication,

        updateEditField,
        updateNewApplicationField,
    };
}