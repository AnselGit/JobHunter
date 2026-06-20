import { Head } from '@inertiajs/react';
import { useMemo, useState, useEffect, useRef } from 'react';
import logoUrl from '../../assets/JobHunter_Logo.png';
import JobHunterLogo from "../../assets/JobHunterBlue_Logo.png";
import { Plus, ChevronUp, Menu, X } from "lucide-react";

type Application = {
    id: number;
    company: string;
    location: string;
    salary: string;
    dateApplied: string;
    status: string;
    note?: string;
};

const SAMPLE_DATA: Application[] = [
    { id: 1, company: 'Acme Corp', location: 'Remote', salary: '$90k', dateApplied: '2026-06-01', status: 'Applied', note: 'Follow up in 2 weeks' },
    { id: 2, company: 'Globex', location: 'New York, NY', salary: '$110k', dateApplied: '2026-05-15', status: 'Interview', note: 'Phone screen completed' },
    { id: 3, company: 'Initech', location: 'Austin, TX', salary: '$95k', dateApplied: '2026-04-28', status: 'Offer', note: 'Offer pending' },
    { id: 4, company: 'Umbrella', location: 'San Francisco, CA', salary: '$130k', dateApplied: '2026-03-10', status: 'Rejected', note: 'No response' },
    { id: 5, company: 'Stark Industries', location: 'Los Angeles, CA', salary: '$140k', dateApplied: '2026-05-02', status: 'Applied', note: 'Submitted portfolio' },
    { id: 6, company: 'Wayne Enterprises', location: 'Gotham', salary: '$120k', dateApplied: '2026-05-22', status: 'Interview', note: 'Onsite scheduled' },
];

export default function Track() {
    // ---------- State ----------
    const [query, setQuery] = useState<string>('');
    const [logoMounted, setLogoMounted] = useState(false);
    const [data, setData] = useState<Application[]>(SAMPLE_DATA);
    const [sortBy, setSortBy] = useState<keyof Application | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState<number>(1);
    const [showModal, setShowModal] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [newApplication, setNewApplication] = useState({
        company: '',
        location: '',
        salary: '',
        dateApplied: '',
        status: 'Applied',
        note: '',
    });

    const itemsPerPage = 10;

    // ---------- Refs ----------
    const trackRef = useRef<HTMLElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    // ---------- Static content (footer links etc.) ----------
    const companyLinks = ['About', 'Features', 'Contact', 'Privacy Policy', 'Terms of Service'];
    const resources = ['Help Center', 'Documentation', 'Career Tips', 'Resume Guide', 'FAQ'];
    const contacts = ['LinkedIn', 'GitHub', 'X (Twitter)', 'Email'];

    // ---------- Helpers ----------
    const parseSalary = (val?: string) => {
        if (!val) return 0;
        let s = String(val).toLowerCase().replace(/\$/g, '').replace(/,/g, '').trim();
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

    const STATUS_COLORS: Record<string, string> = {
        applied: 'bg-sky-100 text-sky-700',
        interview: 'bg-yellow-100 text-yellow-700',
        offer: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        default: 'bg-gray-100 text-gray-700',
    };

    const statusSelectClass = (s: string) =>
        STATUS_COLORS[(s || '').toLowerCase()] ?? STATUS_COLORS.default;

    const statusClass = (s: string) =>
        `inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusSelectClass(s)}`;

    // ---------- Derived data ----------
    const filtered = useMemo(() => {
        let result = data;

        if (query.trim()) {
            const q = query.toLowerCase();
            result = data.filter((a) =>
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
                    const da = new Date(av).getTime() || 0;
                    const db = new Date(bv).getTime() || 0;
                    cmp = da - db;
                } else if (sortBy === 'salary') {
                    cmp = parseSalary(av) - parseSalary(bv);
                } else {
                    cmp = String(av || '').localeCompare(String(bv || ''));
                }

                return sortDir === 'asc' ? cmp : -cmp;
            });
        }

        return result;
    }, [query, data, sortBy, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

    const paginated = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, page]);

    const startIndex = filtered.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(page * itemsPerPage, filtered.length);

    // ---------- Effects ----------
    useEffect(() => {
        setLogoMounted(true);
    }, []);

    useEffect(() => {
        setPage(1);
    }, [filtered]);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ---------- Handlers ----------
    const handleSort = (key: keyof Application) => {
        if (sortBy === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortDir('asc');
        }
        setPage(1);
    };

    const updateField = (id: number, field: Exclude<keyof Application, 'id'>, value: string) => {
        setData((prev) => prev.map((a) => (a.id === id ? ({ ...a, [field]: value } as Application) : a)));
    };

    const addApplication = () => {
        if (!newApplication.company.trim()) return;

        const application: Application = {
            id: Date.now(),
            ...newApplication,
        };

        setData((prev) => [application, ...prev]);

        setNewApplication({
            company: '',
            location: '',
            salary: '',
            dateApplied: '',
            status: 'Applied',
            note: '',
        });

        setShowModal(false);
    };

    // ---------- Scroll utilities ----------
    const smoothScrollTo = (targetY: number, duration = 650) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        let startTime: number | null = null;

        const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);

            window.scrollTo(0, startY + diff * eased);

            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const scrollToSection = (
        ref: React.RefObject<HTMLElement | HTMLDivElement | null>,
        offset = 80
    ) => {
        if (!ref.current) return;
        const targetY = ref.current.getBoundingClientRect().top + window.scrollY - offset;
        smoothScrollTo(targetY, 700);
    };

    const scrollToTop = () => smoothScrollTo(0, 650);

    const goToSection = (ref: React.RefObject<HTMLElement | HTMLDivElement | null>, offset = 80) => {
        scrollToSection(ref, offset);
        setMobileMenuOpen(false);
    };

    // ---------- Shared JSX bits ----------
    const navButtonClass =
        'cursor-pointer px-2 py-1 rounded-md transition-all duration-300 hover:text-white hover:bg-white/10 hover:scale-105 text-left';

    const thClass = 'px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide';

    const SORTABLE_COLUMNS: { key: keyof Application; label: string }[] = [
        { key: 'company', label: 'Company' },
        { key: 'location', label: 'Location' },
        { key: 'salary', label: 'Salary' },
        { key: 'dateApplied', label: 'Date Applied' },
        { key: 'status', label: 'Status' },
    ];

    const renderSortIndicator = (key: keyof Application) => {
        if (sortBy !== key) return <span className="text-xs text-slate-400">↕</span>;
        return <span className="text-xs text-sky-600">{sortDir === 'asc' ? '▲' : '▼'}</span>;
    };

    const updateNewApplicationField = (field: keyof typeof newApplication, value: string) => {
        setNewApplication((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <Head title="Track" />

            <div className="track-hero min-h-screen flex items-center relative">
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
                        <h1 className="leading-relaxed">
                            <div className="text-[clamp(36px,9vw,128px)] text-white font-sans font-semibold">
                                Track <span className="font-normal">Every</span>
                            </div>

                            <div className="flex justify-end">
                                <span className="italic application-text text-[clamp(36px,9vw,128px)]">
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
                        <p className="application-text mt-6 lg:mt-0 lg:absolute lg:left-0 lg:bottom-0 lg:p-12 max-w-xl text-base sm:text-lg lg:text-xl text-sky-300">
                            Organize applications, monitor interview stages, track responses,
                            and never miss an opportunity again.
                        </p>
                    </div>
                </div>
            </div>

            <section ref={trackRef} className="track-section min-h-screen py-12">
                <div
                    className="absolute left-0 right-0 top-0 h-px opacity-90 pointer-events-none"
                    aria-hidden="true"
                    style={{ background: '#CCE8FF' }}
                />

                <div className="track-overlay absolute inset-0 flex items-center justify-center z-30 pointer-events-auto">
                    <div className="w-full max-w-6xl px-4 sm:px-6">
                        <div className="mb-6 flex justify-center">
                            <div className="w-full max-w-2xl">
                                <div className="grid grid-cols-[1fr_auto] gap-3">
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
                                            transition
                                        "
                                    />
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
                                            transition
                                        "
                                    >
                                        <Plus size={22} strokeWidth={2.5} />
                                    </button>
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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {filtered.length > 0 ? (
                                            paginated.map((a) => (
                                                <tr key={a.id} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors">
                                                    <td className="px-3 py-3 align-top text-sm text-slate-800">
                                                        <input
                                                            value={a.company}
                                                            onChange={(e) => updateField(a.id, 'company', e.target.value)}
                                                            className="w-full bg-transparent focus:outline-none text-sm text-slate-800"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3 align-top text-sm text-slate-700">
                                                        <input
                                                            value={a.location}
                                                            onChange={(e) => updateField(a.id, 'location', e.target.value)}
                                                            className="w-full bg-transparent focus:outline-none text-sm text-slate-700"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3 align-top text-sm text-slate-700">
                                                        <input
                                                            value={a.salary}
                                                            onChange={(e) => updateField(a.id, 'salary', e.target.value)}
                                                            className="w-full bg-transparent focus:outline-none text-sm text-slate-700"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3 align-top text-sm text-slate-700">
                                                        <input
                                                            type="date"
                                                            value={a.dateApplied}
                                                            onChange={(e) => updateField(a.id, 'dateApplied', e.target.value)}
                                                            className="w-full bg-transparent focus:outline-none text-sm text-slate-700"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3 align-top text-sm">
                                                        <select
                                                            value={a.status}
                                                            onChange={(e) => updateField(a.id, 'status', e.target.value)}
                                                            className={`rounded-full px-2 py-1 text-sm ${statusSelectClass(a.status)}`}
                                                        >
                                                            <option>Applied</option>
                                                            <option>Interview</option>
                                                            <option>Offer</option>
                                                            <option>Rejected</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-3 py-3 align-top text-sm text-slate-500">
                                                        <input
                                                            value={a.note || ''}
                                                            onChange={(e) => updateField(a.id, 'note', e.target.value)}
                                                            className="w-full bg-transparent focus:outline-none text-sm text-slate-500"
                                                        />
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
                    </div>
                </div>
            </section>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-modalIn">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Add Application</h2>
                                <p className="text-xs text-slate-500">Track your next opportunity</p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body — scrolls internally if the modal is taller than the viewport */}
                        <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Company</label>
                                <input
                                    value={newApplication.company}
                                    onChange={(e) => updateNewApplicationField('company', e.target.value)}
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-200
                                        px-3 py-2.5
                                        focus:ring-2
                                        focus:ring-sky-500
                                        focus:border-sky-500
                                        outline-none
                                    "
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
                                    <input
                                        value={newApplication.location}
                                        onChange={(e) => updateNewApplicationField('location', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Salary</label>
                                    <input
                                        value={newApplication.salary}
                                        onChange={(e) => updateNewApplicationField('salary', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Applied</label>
                                    <input
                                        type="date"
                                        value={newApplication.dateApplied}
                                        onChange={(e) => updateNewApplicationField('dateApplied', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                                    <select
                                        value={newApplication.status}
                                        onChange={(e) => updateNewApplicationField('status', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                                    >
                                        <option>Applied</option>
                                        <option>Interview</option>
                                        <option>Offer</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                                <textarea
                                    rows={3}
                                    value={newApplication.note}
                                    onChange={(e) => updateNewApplicationField('note', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={addApplication}
                                className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="footer-area">
                <footer ref={aboutRef} className="track-footer">
                    <div className="relative z-10 mx-auto max-w-7xl px-6">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">About JobHunter</h2>
                        <p className="mt-3 w-full text-base sm:text-lg lg:text-xl">
                            Turn Job Searching Into a Structured Process
                            <br />
                            <br />
                            Finding a job shouldn't feel like managing dozens of browser tabs, spreadsheets, and forgotten emails.
                            Our platform helps job seekers organize every application, monitor interview progress, track responses, and gain insights into their job search performance all in one place.
                            Whether you're a student applying for your first role, a fresh graduate entering the workforce, or a professional exploring new opportunities, keeping your applications organized can make the difference between missed chances and successful offers.
                        </p>

                        <div className="mt-12 relative left-1/2 right-1/2 mx-[-50vw] w-screen border-y border-white">
                            <div className="mx-auto max-w-7xl">
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="pl-6 pr-6 pb-12 pt-12 md:border-l border-white">
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

                                    <div className="pl-6 pr-6 pb-12 pt-12 md:border-x border-white">
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

                                    <div className="pl-6 pr-6 pb-12 pt-12 md:border-r border-white">
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
        </>
    );
}