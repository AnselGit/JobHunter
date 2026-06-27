import { Head } from '@inertiajs/react';
import { useMemo, useState, useEffect, useRef } from 'react';
import logoUrl from '../../assets/JobHunter_Logo.png';
import JobHunterLogo from "../../assets/JobHunterBlue_Logo.png";
import { Plus, ChevronUp, Menu, X, Eye, EyeOff, Pencil, Trash2, MoreVertical } from "lucide-react";
import { useForm, router, usePage } from '@inertiajs/react';
import { useApplications } from '@/hooks/useApplications';
import type { Application } from '@/types/application';
import { useAuth } from '@/hooks/useAuth';
import { useScroll } from '@/hooks/useScroll';
import AddModal from '@/components/AddModal';
import EditModal from '@/components/EditModal';
import DeleteModal from '@/components/DeleteModal';
import BatchDeleteModal from '@/components/BatchDeleteModal';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

interface PageProps { auth: any; applications: Application[]; }

export default function Track({ auth, applications, }: PageProps) {
    const [showBatchMenu, setShowBatchMenu] = useState(false);
    const app = useApplications(applications);
    const authHook = useAuth();
    const scroll = useScroll();
    const isAuthenticated = !!auth?.id;

    const navButtonClass = "hover:text-white/100 text-white/80 transition hover:scale-105";
    const thClass = "px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase";

    const companyLinks = [
        'About Us',
        'Careers',
        'Blog',
    ];

    const resources = [
        'Docs',
        'Support',
        'Guides',
    ];

    const contacts = [
        'Email',
        'LinkedIn',
        'Twitter',
    ];

    const statusSelectClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'offer':
                return 'bg-green-100 text-green-700';

            case 'rejected':
                return 'bg-red-100 text-red-700';

            case 'interview':
                return 'bg-blue-100 text-blue-700';

            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    const renderSortIndicator = (key: keyof Application) => {
        if (sortBy !== key) return null;

        return sortDir === 'asc' ? '▲' : '▼';
    };

    const SORTABLE_COLUMNS: { key: keyof Application; label: string }[] = [
        { key: 'company', label: 'Company' },
        { key: 'location', label: 'Location' },
        { key: 'salary', label: 'Salary' },
        { key: 'dateApplied', label: 'Date' },
        { key: 'status', label: 'Status' },
    ];

    //Destructures
    const {
        query,
        setQuery,

        filtered,
        paginated,

        page,
        setPage,

        totalPages,
        startIndex,
        endIndex,

        sortBy,
        sortDir,
        handleSort,

        showModal,
        setShowModal,

        newApplication,
        updateNewApplicationField,
        addApplication,

        showEditModal,
        setShowEditModal,

        editForm,
        setEditForm,
        updateEditField,

        showDeleteModal,
        setShowDeleteModal,

        deleteTarget,
        setDeleteTarget,

        showBatchDeleteModal,
        setShowBatchDeleteModal,

        batchDeleteType,
        batchTargets,
        setBatchTargets,

        openBatchDelete,
        deleteBatchApplications,

        isSaving,
        setIsSaving,

        toast,
        setToast,
    } = app;

    const {
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

        forgotStep,
        setForgotStep,

        forgotEmail,
        setForgotEmail,

        resendCooldown,
        setResendCooldown,

        expiryCountdown,

        newPassword,
        setNewPassword,

        confirmNewPassword,
        setConfirmNewPassword,

        resetForgotPassword,
    } = authHook;

    const {
        logoMounted,

        showScrollTop,

        mobileMenuOpen,
        setMobileMenuOpen,

        trackRef,
        aboutRef,
        contactRef,

        scrollToSection,
        scrollToTop,
        goToSection,
    } = scroll;
    

    return (
        <>
            <Head title="JobHunter" />

            <div className="track-hero flex items-center relative">
                <header className="absolute inset-x-0 top-0 z-20">
                    <div className="container mx-auto px-4 sm:px-6 py-6">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                            <div className="flex items-center gap-3">
                                {logoMounted && (
                                    <img src={logoUrl} alt="JobHunter logo" className="h-8 w-auto" />
                                )}
                                <div className="text-xl sm:text-2xl font-bold text-white">JobHunter</div>
                            </div>

                            <nav className="hidden md:flex justify-center gap-6 text-sm text-white/90">
                                <button onClick={() => scrollToSection(trackRef, 0)} className={navButtonClass}>
                                    Home
                                </button>
                                <button onClick={() => scrollToSection(aboutRef)} className={navButtonClass}>
                                    About
                                </button>
                                <button onClick={() => scrollToSection(contactRef)} className={navButtonClass}>
                                    Contact
                                </button>
                            </nav>

                            <div className="hidden md:flex justify-end">
                                <button
                                    onClick={() => scrollToSection(trackRef, 0)}
                                    className="
                                        application-text
                                        rounded-full
                                        bg-white/90
                                        px-4 py-1
                                        text-sm
                                        shadow
                                        transition-all
                                        duration-300
                                        hover:bg-white
                                        hover:scale-105
                                        hover:shadow-xl
                                        hover:-translate-y-0.5
                                    "
                                >
                                    Get Started
                                </button>

                                {isAuthenticated && (
                                    <button
                                        onClick={() => {
                                            router.post('/logout');
                                            resetAuthForm();
                                        }}
                                        className="
                                            application-text
                                            rounded-full
                                            bg-white/90
                                            ml-4
                                            px-4 py-1
                                            text-sm
                                            shadow
                                            transition-all
                                            duration-300
                                            hover:bg-white
                                            hover:scale-105
                                            hover:shadow-xl
                                            hover:-translate-y-0.5
                                        "
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>

                            

                            {/* Mobile menu trigger — fills the same slot the desktop "Get Started" button uses */}
                            <button
                                onClick={() => setMobileMenuOpen((open) => !open)}
                                className="md:hidden col-start-3 justify-self-end flex items-center justify-center h-10 w-10 rounded-full text-white hover:bg-white/10 transition"
                                aria-label="Toggle menu"
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>

                        {mobileMenuOpen && (
                            <nav className="md:hidden mt-4 flex flex-col gap-1 rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-white animate-fadeIn">
                                <button onClick={() => goToSection(trackRef, 0)} className={navButtonClass}>
                                    Home
                                </button>
                                <button onClick={() => goToSection(aboutRef)} className={navButtonClass}>
                                    About
                                </button>
                                <button onClick={() => goToSection(contactRef)} className={navButtonClass}>
                                    Contact
                                </button>
                                <button
                                    onClick={() => goToSection(trackRef, 0)}
                                    className="application-text mt-2 w-full text-center rounded-full bg-white/90 px-4 py-2 text-sm shadow hover:bg-white transition"
                                >
                                    Get Started
                                </button>
                            </nav>
                        )}
                    </div>
                </header>

                <div className="track-hero-content relative z-10 w-full px-6 lg:px-12 min-h-screen flex items-center">
                    <div className="w-full max-w-7xl mx-auto">
                        <h1 className="leading-tight sm:leading-relaxed">
                            <div className="text-[2.5rem] min-[375px]:text-[3rem] min-[425px]:text-[clamp(4.5rem,9vw,8rem)] text-white font-sans font-semibold">
                                Track <span className="font-normal">Every</span>
                            </div>

                            <div className="flex justify-end">
                                <span className="italic application-text text-[2.5rem] min-[375px]:text-[3rem] min-[425px]:text-[clamp(4.5rem,9vw,8rem)]">
                                    Application
                                </span>
                            </div>
                        </h1>

                        <div className="mt-4 lg:grid lg:grid-cols-2 lg:items-center gap-6">
                            <div className="hidden lg:block">
                                {/* decorative / illustration space */}
                            </div>
                        </div>

                        {/* Stacks under the title on mobile/tablet; pins to the bottom-left corner of the hero on large screens, matching the original desktop layout */}
                        <p className="application-text mt-6 lg:mt-0 lg:absolute lg:left-0 lg:bottom-8 lg:p-12 max-w-full text-base sm:text-lg lg:text-xl text-sky-300">
                            Organize applications, monitor interview stages, track responses,
                            and never miss an opportunity again.
                        </p>
                    </div>
                </div>
            </div>

            <section ref={trackRef} className="track-section py-12">
                <div
                    className="absolute left-0 right-0 top-0 h-px opacity-90 pointer-events-none"
                    aria-hidden="true"
                    style={{ background: '#CCE8FF' }}
                />

                <div className="track-overlay absolute inset-0 flex items-center justify-center z-30 pointer-events-auto">

                    <div className="w-full max-w-6xl px-4 sm:px-6">

                        {!isAuthenticated ? (
                            <div className="flex items-center justify-center min-h-150">
                                <div className="w-full max-w-md mx-auto">
                                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">

                                        {/* Toggle */}
                                        <div className="flex rounded-full bg-slate-100 p-1 mb-6">
                                            <button
                                                onClick={() => {
                                                    setAuthMode('login');
                                                    resetAuthForm();
                                                }}
                                                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                                                    authMode === 'login'
                                                        ? 'bg-sky-500 text-white'
                                                        : 'text-slate-600'
                                                }`}
                                            >
                                                Login
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setAuthMode('register');
                                                    resetAuthForm();
                                                }}
                                                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                                                    authMode === 'register'
                                                        ? 'bg-sky-500 text-white'
                                                        : 'text-slate-600'
                                                }`}
                                            >
                                                Register
                                            </button>
                                        </div>

                                        <h2 className="text-2xl font-semibold text-center mb-2">
                                            {authMode === 'login'
                                                ? 'Welcome Back'
                                                : 'Create Account'}
                                        </h2>

                                        <p className="text-center text-slate-500 text-sm mb-6">
                                            {authMode === 'login'
                                                ? 'Sign in to access your application tracker.'
                                                : 'Create an account to start tracking applications.'}
                                        </p>

                                        {authError && (
                                            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                                                {authError}
                                            </div>
                                        )}

                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleAuthSubmit();
                                            }}
                                            className="space-y-4"
                                        >

                                            {authMode === 'register' && (
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    value={authForm.name}
                                                    onChange={(e) =>
                                                        setAuthForm((prev) => ({
                                                            ...prev,
                                                            name: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                                />
                                            )}

                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                value={authForm.email}
                                                onChange={(e) =>
                                                    setAuthForm((prev) => ({
                                                        ...prev,
                                                        email: e.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                            />

                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Password"
                                                    value={authForm.password}
                                                    onChange={(e) =>
                                                        setAuthForm((prev) => ({
                                                            ...prev,
                                                            password: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {authMode === 'register' && (
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        placeholder="Confirm Password"
                                                        value={authForm.confirmPassword}
                                                        onChange={(e) =>
                                                            setAuthForm((prev) => ({
                                                                ...prev,
                                                                confirmPassword: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(!showConfirmPassword)
                                                        }
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className="
                                                    w-full
                                                    rounded-xl
                                                    bg-sky-500
                                                    hover:bg-sky-600
                                                    text-white
                                                    py-3
                                                    font-medium
                                                    transition-all
                                                    duration-300
                                                    hover:scale-[1.02]
                                                "
                                            >
                                                {authMode === 'login'
                                                    ? 'Login'
                                                    : 'Create Account'}
                                            </button>

                                            {authMode === 'login' && (
                                                <div className="mt-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowForgotModal(true)}
                                                        className="
                                                            text-sm
                                                            text-sky-600
                                                            hover:text-sky-700
                                                            hover:underline
                                                        "
                                                    >
                                                        Forgot Password?
                                                    </button>
                                                </div>
                                            )}
                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex justify-center">
                                    <div className="w-full max-w-4xl">
                                        {/* toolbar */}
                                        <div className="grid grid-cols-[1fr_auto_auto] gap-3">
                                            <input
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                placeholder="Search companies, locations, notes..."
                                                className="
                                                    w-full
                                                    rounded-full
                                                    bg-white/80
                                                    backdrop-blur-sm-[2px]
                                                    border border-white/30
                                                    px-4 py-3
                                                    shadow-md
                                                    focus:outline-none
                                                    focus:ring-2
                                                    focus:ring-sky-300
                                                "
                                            />

                                            {/* Add Button */}
                                            <button
                                                onClick={() => setShowModal(true)}
                                                className="
                                                    rounded-full
                                                    bg-sky-600
                                                    hover:bg-sky-700
                                                    w-12 h-12
                                                    flex items-center justify-center
                                                    text-white
                                                    shadow-lg
                                                    transition-all
                                                    duration-200
                                                    hover:scale-105
                                                "
                                            >
                                                <Plus size={22} strokeWidth={2.5} />
                                            </button>

                                            {/* Batch Menu */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowBatchMenu((v) => !v)}
                                                    className="
                                                        rounded-full
                                                        bg-white
                                                        hover:bg-slate-50
                                                        w-12 h-12
                                                        flex items-center justify-center
                                                        text-slate-700
                                                        shadow-lg
                                                        transition-all
                                                        duration-200
                                                        hover:scale-105
                                                    "
                                                >
                                                    <MoreVertical size={20} />
                                                </button>

                                                {showBatchMenu && (
                                                    <div className="absolute right-0 mt-2 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                                        <button
                                                            onClick={() => {
                                                                openBatchDelete('all');
                                                                setShowBatchMenu(false);
                                                            }}
                                                            className="w-full px-4 py-2 text-left hover:bg-slate-50"
                                                        >
                                                            Delete All
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                openBatchDelete('applied');
                                                                setShowBatchMenu(false);
                                                            }}
                                                            className="w-full px-4 py-2 text-left hover:bg-slate-50"
                                                        >
                                                            Delete Applied
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                openBatchDelete('interview');
                                                                setShowBatchMenu(false);
                                                            }}
                                                            className="w-full px-4 py-2 text-left hover:bg-slate-50"
                                                        >
                                                            Delete Interview
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                openBatchDelete('offer');
                                                                setShowBatchMenu(false);
                                                            }}
                                                            className="w-full px-4 py-2 text-left hover:bg-slate-50"
                                                        >
                                                            Delete Offer
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                openBatchDelete('rejected');
                                                                setShowBatchMenu(false);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete Rejected
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-xl p-4 sm:p-6 mx-auto max-w-6xl">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-180 w-full divide-y divide-slate-200">
                                            <thead>
                                                <tr>
                                                    {SORTABLE_COLUMNS.map(({ key, label }) => (
                                                        <th key={key} className={thClass}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSort(key)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <span>{label}</span>
                                                                {renderSortIndicator(key)}
                                                            </button>
                                                        </th>
                                                    ))}
                                                    <th className={thClass}>Note</th>
                                                    <th className={`${thClass} w-20`}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
                                                {filtered.length > 0 ? (
                                                    paginated.map((a) => (
                                                        <tr key={a.id} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors">

                                                            {/* Company */}
                                                            <td className="px-3 py-3 align-top text-sm text-slate-800">
                                                                {a.company}
                                                            </td>

                                                            {/* Location */}
                                                            <td className="px-3 py-3 align-top text-sm text-slate-700">
                                                                {a.location}
                                                            </td>

                                                            {/* Salary */}
                                                            <td className="px-3 py-3 align-top text-sm text-slate-700">
                                                                {a.salary}
                                                            </td>

                                                            {/* Date Applied */}
                                                            <td className="px-3 py-3 align-top text-sm text-slate-700">
                                                                {a.dateApplied}
                                                            </td>

                                                            {/* Status */}
                                                            <td className="px-3 py-3 align-top text-sm">
                                                                <span className={`inline-flex rounded-full px-2 py-1 text-sm ${statusSelectClass(a.status)}`}>
                                                                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                                                                </span>
                                                            </td>

                                                            {/* Note */}
                                                            <td className="px-3 py-3 align-top text-sm text-slate-500">
                                                                {a.note || '-'}
                                                            </td>

                                                            <td className="px-3 py-3 align-top text-sm">
                                                                <div className="flex items-center gap-3">

                                                                    {/* Edit */}
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditForm({ ...a });
                                                                            setShowEditModal(true);
                                                                        }}
                                                                        className="text-sky-600 hover:text-sky-800 transition"
                                                                    >
                                                                        <Pencil size={18} />
                                                                    </button>

                                                                    {/* Delete */}
                                                                    <button
                                                                        onClick={() => {
                                                                            setDeleteTarget(a);
                                                                            setShowDeleteModal(true);
                                                                        }}
                                                                        className="text-red-500 hover:text-red-700 transition"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="py-10 text-center text-slate-400">No results found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
                                        <div>
                                            Showing {startIndex === 0 ? 0 : startIndex} - {endIndex} of {filtered.length}
                                        </div>

                                        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                                            <button
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                disabled={page <= 1}
                                                className={`shrink-0 px-3 py-1 rounded ${page <= 1 ? 'text-slate-400' : 'text-slate-700 hover:bg-slate-100'}`}
                                            >
                                                Prev
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={`shrink-0 px-3 py-1 rounded ${p === page ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={page >= totalPages}
                                                className={`shrink-0 px-3 py-1 rounded ${page >= totalPages ? 'text-slate-400' : 'text-slate-700 hover:bg-slate-100'}`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </section>

            <div className="footer-area">
                <footer ref={aboutRef} className="track-footer">
                    <div className="relative z-10 mx-auto max-w-7xl px-6">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">About JobHunter</h2>
                        <p className="mt-3 w-full text-base sm:text-lg lg:text-xl text-justify">
                            Turn Job Searching Into a Structured Process
                            <br />
                            <br />
                            Finding a job shouldn't feel like managing dozens of browser tabs, spreadsheets, and forgotten emails.
                            Our platform helps job seekers organize every application, monitor interview progress, track responses, and gain insights into their job search performance all in one place.
                            Whether you're a student applying for your first role, a fresh graduate entering the workforce, or a professional exploring new opportunities, keeping your applications organized can make the difference between missed chances and successful offers.
                        </p>

                        <div className="mt-12 relative left-1/2 right-1/2 mx-[-50vw] w-screen border-y border-white">
                            <div className="mx-auto max-w-7xl">
                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y divide-white/30 sm:divide-y-0">
                                    <div className="px-6 py-6 sm:px-4 sm:py-8 md:px-6 md:py-12 sm:border-l border-white">
                                        <h4 className="mb-3 font-medium">Company</h4>
                                        <ul className="list-disc list-inside space-y-2 text-sm">
                                            {companyLinks.map((item) => (
                                                <li key={item}>
                                                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="px-6 py-6 sm:px-4 sm:py-8 md:px-6 md:py-12 sm:border-x border-white">
                                        <h4 className="mb-3 font-medium">Resources</h4>
                                        <ul className="list-disc list-inside space-y-2 text-sm">
                                            {resources.map((item) => (
                                                <li key={item}>
                                                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="px-6 py-6 sm:px-4 sm:py-8 md:px-6 md:py-12 sm:border-r border-white">
                                        <h4 className="mb-3 font-medium">Contact</h4>
                                        <ul className="list-disc list-inside space-y-2 text-sm">
                                            {contacts.map((item) => (
                                                <li key={item}>
                                                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                <div ref={contactRef} className="footer-last">
                    <div className="footer-brand flex flex-col sm:flex-row items-center justify-center gap-4 lg:scale-125">
                        <img src={JobHunterLogo} alt="JobHunter Logo" className="h-16 sm:h-24 lg:h-32 w-auto" />
                        <h1 className="jobhunter-logo-large font-semibold text-center">JobHunter</h1>
                    </div>
                </div>
            </div>

            <button
                onClick={scrollToTop}
                className={`
                    fixed
                    bottom-6
                    right-6
                    sm:bottom-8
                    sm:right-8
                    z-50
                    h-12
                    w-12
                    sm:h-14
                    sm:w-14
                    rounded-full
                    bg-white
                    text-[#53B2FF]
                    shadow-xl
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:shadow-2xl
                    ${showScrollTop
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"}
                `}
            >
                <ChevronUp size={24} strokeWidth={2.5} />
            </button>

            <AddModal
                open={app.showModal}
                onClose={() => app.setShowModal(false)}
                newApplication={app.newApplication}
                updateField={app.updateNewApplicationField}
                onSubmit={app.addApplication}
            />

            <EditModal
                open={app.showEditModal}
                editForm={app.editForm}
                setEditForm={app.setEditForm}
                updateField={app.updateEditField}
                isSaving={app.isSaving}
                onClose={() => {
                    app.setShowEditModal(false);
                    app.setEditForm(null);
                }}
                onSave={app.saveApplication}
            />

            <DeleteModal
                open={app.showDeleteModal}
                deleteTarget={app.deleteTarget}
                onClose={() => {
                    app.setShowDeleteModal(false);
                    app.setDeleteTarget(null);
                }}
                onDelete={app.deleteApplication}
            />

            <BatchDeleteModal
                open={showBatchDeleteModal}
                batchType={batchDeleteType}
                applications={batchTargets}
                isDeleting={isSaving}
                onClose={() => {
                    setShowBatchDeleteModal(false);
                    setBatchTargets([]);
                }}
                onConfirm={deleteBatchApplications}
            />

            <ForgotPasswordModal
                open={showForgotModal}
                forgotStep={forgotStep}
                forgotEmail={forgotEmail}
                setForgotEmail={setForgotEmail}
                expiryCountdown={expiryCountdown}
                resendCooldown={resendCooldown}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
                onClose={resetForgotPassword}

                
                onSendVerification={() => {
                    router.post(
                        '/forgot-password/send',
                        {
                            email: forgotEmail,
                        },
                        {
                            preserveScroll: true,

                            onStart: () => {
                                console.log('START');
                            },

                            onProgress: () => {
                                console.log('PROGRESS');
                            },

                            onSuccess: (page) => {
                                console.log('SUCCESS', page);

                                setForgotStep('waiting');
                                setResendCooldown(30);
                            },

                            onError: (errors) => {
                                console.log('ERROR', errors);
                            },

                            onFinish: () => {
                                console.log('FINISH');
                            },
                        }
                    );
                }}

                onCheckVerification={() => {
                    setForgotStep('reset');
                }}

                onResend={() => {
                    setResendCooldown(30);
                }}

                onResetPassword={() => {}}
            />

            {toast && (
                <div
                    className={`
                        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                        px-4 py-3 rounded-xl shadow-lg text-white
                        transition-all duration-300
                        ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
                    `}
                >
                    {toast.message}
                </div>
            )}
        </>
    );
}