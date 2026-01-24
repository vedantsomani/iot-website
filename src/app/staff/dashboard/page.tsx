'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw, LogOut, FileText, Search, User, Briefcase, Calendar } from 'lucide-react';

interface Submission {
    Timestamp: string;
    FullName: string;
    Email: string;
    Phone: string;
    Year: string;
    Branch: string;
    Team: string;
    Role: string;
    Skills: string;
    Motivation: string;
    Portfolio: string;
    ResumeURL: string;
    Status: string;
}

interface UserInfo {
    role: string;
    department?: string;
    displayName: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch('/api/submissions');
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/staff/login');
                    return;
                }
                throw new Error(data.error || 'Failed to fetch data');
            }

            setSubmissions(data.submissions || []);
            setUser(data.user);
        } catch (err) {
            console.error(err);
            setError('DATA_FETCH_ERROR: CONNECTION_REFUSED');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = submissions.filter(s =>
        s.FullName?.toLowerCase().includes(search.toLowerCase()) ||
        s.Email?.toLowerCase().includes(search.toLowerCase()) ||
        s.Team?.toLowerCase().includes(search.toLowerCase()) ||
        s.Role?.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: submissions.length,
        tech: submissions.filter(s => s.Team?.includes('tech')).length,
        design: submissions.filter(s => s.Team?.includes('design')).length,
        research: submissions.filter(s => s.Team?.includes('research')).length,
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center p-4">
                <div className="border border-red-500/50 p-8 rounded-lg bg-red-900/10 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-4 animate-pulse">CRITICAL_ERROR</h1>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500 rounded text-red-400 transition-colors uppercase font-bold tracking-wider"
                    >
                        Reboot_System
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-500/30 overflow-hidden flex flex-col">
            {/* CRT Effect */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />

            {/* Header */}
            <header className="border-b border-green-500/30 bg-black/80 backdrop-blur-md p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center border border-green-500/50">
                        <span className="text-xl font-bold">{user?.department ? user.department.charAt(0).toUpperCase() : 'A'}</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wider flex items-center gap-2">
                            {user?.displayName.toUpperCase() || 'COMMAND_CENTER'}
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </h1>
                        <p className="text-xs text-green-500/60">SECURE_LEVEL_5 | {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={fetchData} className="p-2 hover:bg-green-500/10 rounded-full transition-colors" title="Reload Data">
                        <RefreshCw className={loading ? "animate-spin" : ""} size={20} />
                    </button>
                    <div className="border border-green-500/50 rounded-lg flex items-center px-3 py-1.5 bg-green-500/5">
                        <Search size={16} className="text-green-500/50 mr-2" />
                        <input
                            type="text"
                            placeholder="SEARCH_DB..."
                            className="bg-transparent outline-none text-green-400 placeholder-green-500/30 text-sm w-48"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => router.push('/staff/login')} className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition-colors group" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-green-500/30 border-b border-green-500/30">
                <div className="bg-black p-3 text-center">
                    <div className="text-xs text-green-500/50 uppercase">Total_Assets</div>
                    <div className="text-xl font-bold text-white">{stats.total}</div>
                </div>
                {user?.role === 'president' && (
                    <>
                        <div className="bg-black p-3 text-center">
                            <div className="text-xs text-green-500/50 uppercase">Tech_Unit</div>
                            <div className="text-xl font-bold">{stats.tech}</div>
                        </div>
                        <div className="bg-black p-3 text-center">
                            <div className="text-xs text-green-500/50 uppercase">Design_Unit</div>
                            <div className="text-xl font-bold">{stats.design}</div>
                        </div>
                        <div className="bg-black p-3 text-center">
                            <div className="text-xs text-green-500/50 uppercase">R&D_Unit</div>
                            <div className="text-xl font-bold">{stats.research}</div>
                        </div>
                    </>
                )}
            </div>

            {/* Main Content - Split View */}
            <main className="flex-1 flex overflow-hidden">
                {/* List View */}
                <div className={`${selectedSubmission ? 'w-1/3 hidden md:block' : 'w-full'} overflow-y-auto border-r border-green-500/30`}>
                    {loading ? (
                        <div className="p-8 text-center space-y-4">
                            <div className="inline-block w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <div className="text-xs animate-pulse">DOWNLOADING_PACKETS...</div>
                        </div>
                    ) : (
                        <div className="divide-y divide-green-500/20">
                            {filtered.length === 0 ? (
                                <div className="p-8 text-center text-green-500/50">NO_RECORDS_FOUND</div>
                            ) : (
                                filtered.map((sub, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedSubmission(sub)}
                                        className={`p-4 hover:bg-green-500/10 cursor-pointer transition-colors border-l-2 ${selectedSubmission === sub ? 'border-l-green-400 bg-green-500/10' : 'border-l-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-white truncate">{sub.FullName}</h3>
                                            <span className="text-[10px] bg-green-500/20 px-1.5 py-0.5 rounded text-green-300">
                                                {new Date(sub.Timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-green-500/70 mb-2">
                                            <span className="uppercase">{sub.Team}</span>
                                            <span>•</span>
                                            <span>{sub.Role}</span>
                                        </div>
                                        {/* Mini Tags */}
                                        <div className="flex flex-wrap gap-1">
                                            <span className="px-1.5 py-0.5 bg-green-900/30 rounded text-[10px] text-green-400/80 border border-green-500/20">{sub.Branch}</span>
                                            <span className="px-1.5 py-0.5 bg-green-900/30 rounded text-[10px] text-green-400/80 border border-green-500/20">Yr {sub.Year}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Detail View */}
                <AnimatePresence mode="wait">
                    {selectedSubmission && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`${selectedSubmission ? 'w-full md:w-2/3' : 'hidden'} overflow-y-auto bg-black border-l border-green-500/30 relative`}
                        >
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="md:hidden absolute top-4 right-4 p-2 bg-green-500/20 rounded z-10"
                            >
                                BACK
                            </button>

                            <div className="p-6 md:p-8 space-y-8 max-w-3xl mx-auto">
                                {/* Profile Header */}
                                <div className="flex items-start gap-6 border-b border-green-500/30 pb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                                        {selectedSubmission.FullName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-1">{selectedSubmission.FullName}</h2>
                                        <div className="flex items-center gap-4 text-sm text-green-400">
                                            <span className="flex items-center gap-1"><User size={14} /> {selectedSubmission.Role}</span>
                                            <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedSubmission.Team}</span>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <a
                                                href={`mailto:${selectedSubmission.Email}`}
                                                className="px-4 py-1.5 bg-green-500/10 hover:bg-green-500/30 border border-green-500/50 rounded text-sm transition-colors"
                                            >
                                                EMAIL_COMMLINK
                                            </a>
                                            {selectedSubmission.ResumeURL && (
                                                <a
                                                    href={selectedSubmission.ResumeURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-1.5 bg-blue-500/10 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded text-sm transition-colors flex items-center gap-2"
                                                >
                                                    <FileText size={14} /> VIEW_RESUME
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                                            <h3 className="text-xs uppercase tracking-widest text-green-500/60 mb-3">Academic_Data</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-green-500/50">Branch:</span>
                                                    <span>{selectedSubmission.Branch}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-green-500/50">Year:</span>
                                                    <span>{selectedSubmission.Year}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-green-500/50">Contact:</span>
                                                    <span>{selectedSubmission.Phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                                            <h3 className="text-xs uppercase tracking-widest text-green-500/60 mb-3">Skillset_Matrix</h3>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedSubmission.Skills || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg h-full">
                                            <h3 className="text-xs uppercase tracking-widest text-green-500/60 mb-3">Motivation_Log</h3>
                                            <p className="text-sm leading-relaxed italic opacity-80 whitespace-pre-wrap">"{selectedSubmission.Motivation}"</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedSubmission.Portfolio && (
                                    <div className="p-4 border border-indigo-500/30 bg-indigo-900/10 rounded-lg flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xs uppercase tracking-widest text-indigo-400/60">External_Portfolio</h3>
                                            <p className="text-indigo-300 text-sm truncate max-w-xs">{selectedSubmission.Portfolio}</p>
                                        </div>
                                        <a
                                            href={selectedSubmission.Portfolio}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 hover:bg-indigo-500/20 rounded-full text-indigo-400 transition-colors"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!selectedSubmission && (
                    <div className="hidden md:flex flex-1 items-center justify-center text-green-500/20 flex-col gap-4">
                        <div className="w-24 h-24 border-2 border-dashed border-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                            <RefreshCw size={40} />
                        </div>
                        <p className="uppercase tracking-widest text-sm">Select a file to decrypt...</p>
                    </div>
                )}
            </main>
        </div>
    );
}
