import { Head } from '@inertiajs/react';
import { useMemo, useState, useEffect, useRef } from 'react';
import logoUrl from '../../assets/JobHunter_Logo.png';
import JobHunterLogo from "../../assets/JobHunterBlue_Logo.png";
import { Plus, ChevronUp } from "lucide-react";

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
    const [query, setQuery] = useState<string>('');
    const [logoMounted, setLogoMounted] = useState(false);
    const [data, setData] = useState<Application[]>(SAMPLE_DATA);

    useEffect(() => {
        setLogoMounted(true);
    }, []);

    const [sortBy, setSortBy] = useState<keyof Application | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const parseSalary = (val?: string) => {
        if (!val) return 0;
        let s = String(val).toLowerCase().replace(/\$/g, '').replace(/,/g, '').trim();
        let multiplier = 1;
        if (s.endsWith('k')) {
            multiplier = 1000;
            s = s.slice(0, -1);
        } else if (s.endsWith('m')) {
            multiplier = 1000000;
            s = s.slice(0, -1);
        }
        const n = parseFloat(s);
        return isNaN(n) ? 0 : n * multiplier;
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

    const statusClass = (s: string) => {
        switch ((s || '').toLowerCase()) {
            case 'applied':
                return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700';
            case 'interview':
                return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700';
            case 'offer':
                return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700';
            case 'rejected':
                return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700';
            default:
                return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700';
        }
    };

    const statusSelectClass = (s: string) => {
        switch ((s || '').toLowerCase()) {
            case 'applied':
                return 'bg-sky-100 text-sky-700';
            case 'interview':
                return 'bg-yellow-100 text-yellow-700';
            case 'offer':
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
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

    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setPage(1);
    }, [filtered]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

    const paginated = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, page]);

    const startIndex = filtered.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(page * itemsPerPage, filtered.length);

    const [showModal, setShowModal] = useState(false);

    const [newApplication, setNewApplication] = useState({
        company: '',
        location: '',
        salary: '',
        dateApplied: '',
        status: 'Applied',
        note: '',
    });

    const companyLinks = [
        "About",
        "Features",
        "Contact",
        "Privacy Policy",
        "Terms of Service",
    ];

    const resources = [
        "Help Center",
        "Documentation",
        "Career Tips",
        "Resume Guide",
        "FAQ",
    ];

    const contacts = [
        "LinkedIn",
        "GitHub",
        "X (Twitter)",
        "Email",
    ];

    const trackRef = useRef<HTMLElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    const smoothScrollTo = (targetY: number, duration = 650) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        let startTime: number | null = null;

        const easeInOutCubic = (t: number) =>
            t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const eased = easeInOutCubic(progress);

            window.scrollTo(0, startY + diff * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };
    
    const scrollToSection = (
        ref: React.RefObject<HTMLElement | HTMLDivElement | null>
    ) => {
        if (!ref.current) return;

        const offset = 80; // optional (header spacing)

        const targetY =
            ref.current.getBoundingClientRect().top +
            window.scrollY -
            offset;

        smoothScrollTo(targetY, 700);
    };

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        smoothScrollTo(0, 650);
    };
    
    return (
        <>
            <Head title="Track" />

            <div className="track-hero min-h-screen flex items-center relative">
                <header className="absolute inset-x-0 top-0 z-20">
                    <div className="container mx-auto px-6 py-6">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                            <div className="flex items-center gap-3">
                                {logoMounted && (
                                    <img src={logoUrl} alt="JobHunter logo" className="h-8 w-auto" />
                                )}
                                <div className="text-2xl font-bold text-white">JobHunter</div>
                            </div>
                            <nav className="hidden md:flex justify-center gap-6 text-sm text-white/90">
                                <button
                                    onClick={() => scrollToSection(trackRef)}
                                    className="
                                        cursor-pointer
                                        px-2 py-1
                                        rounded-md
                                        transition-all
                                        duration-300
                                        hover:text-white
                                        hover:bg-white/10
                                        hover:scale-105
                                    "
                                >
                                    Home
                                </button>

                                <button
                                    onClick={() => scrollToSection(aboutRef)}
                                    className="
                                        cursor-pointer
                                        px-2 py-1
                                        rounded-md
                                        transition-all
                                        duration-300
                                        hover:text-white
                                        hover:bg-white/10
                                        hover:scale-105
                                    "
                                >
                                    About
                                </button>

                                <button
                                    onClick={() => scrollToSection(contactRef)}
                                    className="
                                        cursor-pointer
                                        px-2 py-1
                                        rounded-md
                                        transition-all
                                        duration-300
                                        hover:text-white
                                        hover:bg-white/10
                                        hover:scale-105
                                    "
                                >
                                    Contact
                                </button>
                            </nav>
                            <div className="hidden md:flex justify-end">
                                <button
                                    onClick={() => scrollToSection(trackRef)}
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
                        </div>
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
                    </div>

                    <div className="absolute left-0 bottom-0 p-6 lg:p-12">
                        <p className="application-text max-w-xl text-xl text-sky-300">
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
                    <div className="w-full max-w-6xl px-6">
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
                                            w-13 h-13
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

                        <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-xl p-6 mx-auto max-w-6xl">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                <button type="button" onClick={() => handleSort('company')} className="flex items-center gap-2">
                                                    <span>Company</span>
                                                    <span className={`text-xs ${sortBy === 'company' ? 'text-sky-600' : 'text-slate-400'}`}>
                                                        {sortBy === 'company' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                                                    </span>
                                                </button>
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                <button type="button" onClick={() => handleSort('location')} className="flex items-center gap-2">
                                                    <span>Location</span>
                                                    <span className={`text-xs ${sortBy === 'location' ? 'text-sky-600' : 'text-slate-400'}`}>
                                                        {sortBy === 'location' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                                                    </span>
                                                </button>
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                <button type="button" onClick={() => handleSort('salary')} className="flex items-center gap-2">
                                                    <span>Salary</span>
                                                    <span className={`text-xs ${sortBy === 'salary' ? 'text-sky-600' : 'text-slate-400'}`}>
                                                        {sortBy === 'salary' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                                                    </span>
                                                </button>
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                <button type="button" onClick={() => handleSort('dateApplied')} className="flex items-center gap-2">
                                                    <span>Date Applied</span>
                                                    <span className={`text-xs ${sortBy === 'dateApplied' ? 'text-sky-600' : 'text-slate-400'}`}>
                                                        {sortBy === 'dateApplied' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                                                    </span>
                                                </button>
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                <button type="button" onClick={() => handleSort('status')} className="flex items-center gap-2">
                                                    <span>Status</span>
                                                    <span className={`text-xs ${sortBy === 'status' ? 'text-sky-600' : 'text-slate-400'}`}>
                                                        {sortBy === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                                                    </span>
                                                </button>
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Note</th>
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

                            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                                <div>
                                    Showing {startIndex === 0 ? 0 : startIndex} - {endIndex} of {filtered.length}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                        className={`px-3 py-1 rounded ${page <= 1 ? 'text-slate-400' : 'text-slate-700 hover:bg-slate-100'}`}
                                    >
                                        Prev
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`px-3 py-1 rounded ${p === page ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page >= totalPages}
                                        className={`px-3 py-1 rounded ${page >= totalPages ? 'text-slate-400' : 'text-slate-700 hover:bg-slate-100'}`}
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
                <div
                    className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        bg-black/20
                        backdrop-blur-sm
                        p-4
                        animate-fadeIn
                    "
                >
                    <div
                        className="
                            w-full max-w-lg
                            bg-white
                            rounded-2xl
                            shadow-xl
                            border border-slate-200
                            overflow-hidden
                            animate-modalIn
                        "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Add Application
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Track your next opportunity
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="
                                    h-8 w-8
                                    rounded-lg
                                    flex items-center justify-center
                                    text-slate-500
                                    hover:bg-slate-100
                                "
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Company
                                </label>
                                <input
                                    value={newApplication.company}
                                    onChange={(e) =>
                                        setNewApplication({
                                            ...newApplication,
                                            company: e.target.value,
                                        })
                                    }
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

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        Location
                                    </label>
                                    <input
                                        value={newApplication.location}
                                        onChange={(e) =>
                                            setNewApplication({
                                                ...newApplication,
                                                location: e.target.value,
                                            })
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
                                            setNewApplication({
                                                ...newApplication,
                                                salary: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        Applied
                                    </label>
                                    <input
                                        type="date"
                                        value={newApplication.dateApplied}
                                        onChange={(e) =>
                                            setNewApplication({
                                                ...newApplication,
                                                dateApplied: e.target.value,
                                            })
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
                                            setNewApplication({
                                                ...newApplication,
                                                status: e.target.value,
                                            })
                                        }
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
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={newApplication.note}
                                    onChange={(e) =>
                                        setNewApplication({
                                            ...newApplication,
                                            note: e.target.value,
                                        })
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-200
                                        px-3 py-2.5
                                        resize-none
                                    "
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="
                                    px-4 py-2
                                    rounded-full
                                    border border-slate-200
                                    hover:bg-slate-50
                                    transition
                                "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={addApplication}
                                className="
                                    px-4 py-2
                                    rounded-full
                                    bg-sky-600
                                    hover:bg-sky-700
                                    text-white
                                    transition
                                "
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
                        <h2 className="text-6xl font-semibold ">About JobHunter</h2>
                        <p className="mt-3 w-full text-xl ">
                            Turn Job Searching Into a Structured Process

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
                                                    <a
                                                        href="#"
                                                        onClick={(e) => e.preventDefault()}
                                                        className="hover:underline"
                                                    >
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
                                                    <a
                                                        href="#"
                                                        onClick={(e) => e.preventDefault()}
                                                        className="hover:underline"
                                                    >
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
                                                    <a
                                                        href="#"
                                                        onClick={(e) => e.preventDefault()}
                                                        className="hover:underline"
                                                    >
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
                    <div className="footer-brand flex items-center justify-center gap-4">
                        <img
                            src={JobHunterLogo}
                            alt="JobHunter Logo"
                            className="h-32 w-auto"
                        />

                        <h1 className="jobhunter-logo-large font-semibold">
                            JobHunter
                        </h1>
                    </div>
                </div>
            </div>

            <button
                onClick={scrollToTop}
                className={`
                    fixed
                    bottom-8
                    right-8
                    z-50
                    h-14
                    w-14
                    rounded-full
                    bg-[#53B2FF]
                    text-white
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

