'use client';

import { useState } from 'react';
import Link from 'next/link';
import { REWIRE_CONFIG } from '@/lib/rewire/config';
import { AdminStats } from '@/lib/rewire/types';

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'incomplete' | 'freeagents'>('overview');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/rewire/admin/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const result = await response.json();

            if (result.ok) {
                setIsAuthenticated(true);
                setStats(result.data);
            } else {
                setError(result.message || 'Invalid password');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshStats = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/rewire/admin/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const result = await response.json();
            if (result.ok) {
                setStats(result.data);
            }
        } catch {
            // Silently fail on refresh
        } finally {
            setIsLoading(false);
        }
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">{REWIRE_CONFIG.EVENT_NAME} Admin</h1>
                        <p className="text-gray-400 text-sm">Enter password to access dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin Password"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all"
                        >
                            {isLoading ? 'Checking...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <Link href="/rewire/register" className="text-gray-400 text-sm hover:text-cyan-400">
                            ← Back to Registration
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Dashboard
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-400 hover:text-white">
                            ← Home
                        </Link>
                        <h1 className="font-semibold">{REWIRE_CONFIG.EVENT_NAME} Admin</h1>
                    </div>
                    <button
                        onClick={refreshStats}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg
                            className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                        <p className="text-gray-400 text-sm mb-1">Total Participants</p>
                        <p className="text-3xl font-bold text-white">{stats?.totalParticipants || 0}</p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                        <p className="text-gray-400 text-sm mb-1">Free Agents</p>
                        <p className="text-3xl font-bold text-purple-400">{stats?.freeAgents || 0}</p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                        <p className="text-gray-400 text-sm mb-1">Pending Teams</p>
                        <p className="text-3xl font-bold text-yellow-400">{stats?.pendingTeams || 0}</p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                        <p className="text-gray-400 text-sm mb-1">Confirmed Teams</p>
                        <p className="text-3xl font-bold text-green-400">{stats?.confirmedTeams || 0}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'overview'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('incomplete')}
                        className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'incomplete'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Incomplete Teams ({stats?.incompleteTeams?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('freeagents')}
                        className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'freeagents'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Free Agents ({stats?.freeAgentList?.length || 0})
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Quick Summary</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                • <span className="text-white font-medium">{stats?.totalParticipants || 0}</span> total registrations
                            </p>
                            <p>
                                • <span className="text-green-400 font-medium">{stats?.confirmedTeams || 0}</span> complete teams (4/4 members)
                            </p>
                            <p>
                                • <span className="text-yellow-400 font-medium">{stats?.incompleteTeams?.length || 0}</span> incomplete teams need members
                            </p>
                            <p>
                                • <span className="text-purple-400 font-medium">{stats?.freeAgents || 0}</span> free agents looking for teams
                            </p>
                        </div>
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-400 text-sm">
                                💡 Tip: View the Google Sheet for full data access and advanced filtering.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'incomplete' && (
                    <div className="space-y-4">
                        {stats?.incompleteTeams?.length === 0 ? (
                            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                                <p className="text-gray-400">No incomplete teams</p>
                            </div>
                        ) : (
                            stats?.incompleteTeams?.map((team) => (
                                <div key={team.team_code} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-mono font-bold text-cyan-400 text-lg">{team.team_code}</span>
                                        <span className="text-yellow-400 text-sm">
                                            {team.members_count}/{REWIRE_CONFIG.TEAM_SIZE} members
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        <p><span className="text-gray-500">Captain:</span> {team.captain_email}</p>
                                        {team.member_emails && (
                                            <p className="mt-1"><span className="text-gray-500">Members:</span> {team.member_emails}</p>
                                        )}
                                    </div>
                                    <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                                            style={{ width: `${(team.members_count / REWIRE_CONFIG.TEAM_SIZE) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'freeagents' && (
                    <div className="space-y-3">
                        {stats?.freeAgentList?.length === 0 ? (
                            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                                <p className="text-gray-400">No free agents</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {stats?.freeAgentList?.map((agent) => (
                                        <div key={agent.participant_id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                                                    {agent.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white truncate">{agent.name}</p>
                                                    <p className="text-gray-400 text-sm truncate">{agent.email}</p>
                                                    <p className="text-gray-500 text-xs">{agent.phone}</p>
                                                    {agent.skills && (
                                                        <p className="text-purple-400 text-xs mt-1 truncate">{agent.skills}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
