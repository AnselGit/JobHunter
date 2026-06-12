import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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

    const filtered = useMemo(() => {
        if (!query.trim()) return SAMPLE_DATA;
        const q = query.toLowerCase();
        return SAMPLE_DATA.filter((a) =>
            a.company.toLowerCase().includes(q) ||
            a.location.toLowerCase().includes(q) ||
            (a.note || '').toLowerCase().includes(q) ||
            a.status.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <>
            <Head title="Track" />

            <div className="track-hero min-h-screen flex items-center relative">
                <header className="absolute inset-x-0 top-0 z-20">
                    <div className="container mx-auto px-6 py-6">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                            <div className="text-2xl font-bold text-white">JobHunter</div>
                            <nav className="hidden md:flex justify-center gap-6 text-sm text-white/90">
                                <a className="hover:underline" href="#">Home</a>
                                <a className="hover:underline" href="#">Track</a>
                                <a className="hover:underline" href="#">About</a>
                                <a className="hover:underline" href="#">Contact</a>
                            </nav>
                            <div className="hidden md:flex justify-end">
                                <button className="rounded-full bg-white/90 px-4 py-1 text-sm text-sky-700 shadow">Get Started</button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="w-full px-6 lg:px-12">
                    <h1 className="leading-relaxed">
                        <div className="text-[clamp(36px,9vw,128px)] text-white font-sans font-semibold">
                            Track <span className="font-normal">Every</span>
                        </div>

                        <div className="flex justify-end">
                            <span className="italic text-sky-300 text-[clamp(36px,9vw,128px)]">
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
                    <p className="max-w-xl text-xl text-sky-300">
                        Organize applications, monitor interview stages, track responses,
                        and never miss an opportunity again.
                    </p>
                </div>
            </div>

            <section className="bg-transparent py-12">
                <div className="container mx-auto px-6">
                    <div className="mb-6">
                        <div className="grid grid-cols-[1fr_auto] gap-3">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search companies, locations, notes..."
                                className="w-full rounded-full border border-sky-200 px-4 py-3 shadow-sm"
                            />
                            <button className="rounded-full bg-sky-500 px-4 py-3 text-white">Search</button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white shadow p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-sm">
                                <thead>
                                    <tr className="bg-sky-100 text-sky-700">
                                        <th className="p-3 text-left">Company</th>
                                        <th className="p-3 text-left">Location</th>
                                        <th className="p-3 text-left">Salary</th>
                                        <th className="p-3 text-left">Date Applied</th>
                                        <th className="p-3 text-left">Status</th>
                                        <th className="p-3 text-left">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length > 0 ? (
                                        filtered.map((a) => (
                                            <tr key={a.id} className="border-t">
                                                <td className="p-4 align-top">{a.company}</td>
                                                <td className="p-4 align-top">{a.location}</td>
                                                <td className="p-4 align-top">{a.salary}</td>
                                                <td className="p-4 align-top">{a.dateApplied}</td>
                                                <td className="p-4 align-top">{a.status}</td>
                                                <td className="p-4 align-top text-slate-500">{a.note}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-center text-slate-400">
                                                No results found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 grid grid-cols-2 items-center text-sm text-sky-600">
                            <span>Showing {filtered.length} of {SAMPLE_DATA.length}</span>
                            <a href="#" className="underline justify-self-end">Next</a>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/20 bg-transparent py-12">
                <div className="container mx-auto px-6 text-sky-700">
                    <h3 className="text-xl font-semibold text-slate-800">About JobHunter</h3>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600">
                        Turn job searching into a structured process. Keep your applications organized
                        and never miss an opportunity.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <h4 className="mb-2 font-medium text-slate-700">Company</h4>
                            <ul className="text-sm text-slate-600">
                                <li>About</li>
                                <li>Features</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-2 font-medium text-slate-700">Resources</h4>
                            <ul className="text-sm text-slate-600">
                                <li>Help Center</li>
                                <li>Documentation</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-2 font-medium text-slate-700">Contact</h4>
                            <ul className="text-sm text-slate-600">
                                <li>LinkedIn</li>
                                <li>GitHub</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
