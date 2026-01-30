'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProgressIndicator from '@/components/rewire/ProgressIndicator';
import TeamCodeDisplay from '@/components/rewire/TeamCodeDisplay';
import { REWIRE_CONFIG } from '@/lib/rewire/config';
import { StatusResponse, ParticipantStatus } from '@/lib/rewire/types';

type ActionMode = 'idle' | 'create' | 'join' | 'free-agent';

function TeamContent() {
    const searchParams = useSearchParams();

    const [participantId, setParticipantId] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [actionMode, setActionMode] = useState<ActionMode>('idle');
    const [joinCode, setJoinCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Get participant ID from URL or localStorage
    useEffect(() => {
        const urlId = searchParams.get('participant_id');
        const storedId = localStorage.getItem('rewire_participant_id');
        const joinCodeParam = searchParams.get('join');

        const id = urlId || storedId;
        setParticipantId(id);

        if (joinCodeParam) {
            setJoinCode(joinCodeParam.toUpperCase());
            setActionMode('join');
        }
    }, [searchParams]);

    // Fetch status
    const fetchStatus = useCallback(async () => {
        if (!participantId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/rewire/team/status?participant_id=${participantId}`);
            const result = await response.json();

            if (result.ok && result.data) {
                setStatus(result.data);
            } else {
                setError(result.message || 'Failed to load your information');
            }
        } catch {
            setError('Network error. Please refresh the page.');
        } finally {
            setIsLoading(false);
        }
    }, [participantId]);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // Handle Create Team
    const handleCreateTeam = async () => {
        if (!participantId) return;
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/rewire/team/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participant_id: participantId })
            });

            const result = await response.json();

            if (result.ok) {
                setSuccessMessage('Team created successfully! Share your code with friends.');
                await fetchStatus();
                setActionMode('idle');
            } else {
                setError(result.message || 'Failed to create team');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Join Team
    const handleJoinTeam = async () => {
        if (!participantId || !joinCode.trim()) return;
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/rewire/team/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participant_id: participantId,
                    team_code: joinCode.trim().toUpperCase()
                })
            });

            const result = await response.json();

            if (result.ok) {
                setSuccessMessage('Successfully joined the team!');
                await fetchStatus();
                setActionMode('idle');
                setJoinCode('');
            } else {
                setError(result.message || 'Failed to join team');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Free Agent
    const handleFreeAgent = async () => {
        if (!participantId) return;
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/rewire/team/free-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participant_id: participantId })
            });

            const result = await response.json();

            if (result.ok) {
                setSuccessMessage("You're now registered as a free agent. We'll help you find a team at the event!");
                await fetchStatus();
                setActionMode('idle');
            } else {
                setError(result.message || 'Failed to update status');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render helpers
    const renderStatusBadge = (participantStatus: ParticipantStatus) => {
        const badges: Record<ParticipantStatus, { text: string; className: string }> = {
            PROFILE_ONLY: { text: 'Profile Registered', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
            CAPTAIN: { text: 'Team Captain', className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
            MEMBER: { text: 'Team Member', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
            FREE_AGENT: { text: 'Free Agent', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
            CANCELLED: { text: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' }
        };

        const badge = badges[participantStatus];
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.className}`}>
                {badge.text}
            </span>
        );
    };

    // No participant ID - redirect to register
    if (!isLoading && !participantId) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
                    <p className="text-gray-400 mb-6">Please register first to manage your team.</p>
                    <Link
                        href="/rewire/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-medium hover:from-cyan-400 hover:to-blue-500 transition-all"
                    >
                        Go to Registration
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent -z-10" />

            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                            IoT
                        </div>
                        <span className="font-semibold hidden sm:block">IoT & Robotics Club</span>
                    </Link>
                    <span className="text-sm text-gray-400">
                        {REWIRE_CONFIG.EVENT_NAME} Team Setup
                    </span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-lg">
                {/* Progress */}
                <ProgressIndicator currentStep={2} />

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Team Setup
                    </h1>
                    <p className="text-gray-400">
                        Step 2: Choose your team path
                    </p>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full" />
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Status Card */}
                {!isLoading && status?.participant && (
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="font-medium text-white">{status.participant.name}</h2>
                                <p className="text-gray-400 text-sm">{status.participant.email}</p>
                            </div>
                            {renderStatusBadge(status.participant.status)}
                        </div>

                        {/* Already has a team */}
                        {status.team && (
                            <TeamCodeDisplay
                                teamCode={status.team.team_code}
                                membersCount={status.team.members_count}
                                maxMembers={REWIRE_CONFIG.TEAM_SIZE}
                            />
                        )}

                        {/* Show team members */}
                        {status.team && status.team_members && status.team_members.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Team Members</h3>
                                <div className="space-y-2">
                                    {status.team_members.map((member, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white">{member.name}</p>
                                                <p className="text-gray-500 text-xs">{member.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Cards - Only show if no team and not free agent */}
                {!isLoading && status?.participant &&
                    status.participant.status === 'PROFILE_ONLY' &&
                    actionMode === 'idle' && (
                        <div className="space-y-4">
                            {/* Create Team */}
                            <button
                                onClick={() => setActionMode('create')}
                                className="w-full p-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-left hover:border-cyan-500/50 hover:bg-gray-800 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                                        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Create a Team</h3>
                                        <p className="text-gray-400 text-sm">Start a new team and invite friends</p>
                                    </div>
                                </div>
                            </button>

                            {/* Join Team */}
                            <button
                                onClick={() => setActionMode('join')}
                                className="w-full p-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-left hover:border-blue-500/50 hover:bg-gray-800 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Join a Team</h3>
                                        <p className="text-gray-400 text-sm">Enter team code to join existing team</p>
                                    </div>
                                </div>
                            </button>

                            {/* Free Agent */}
                            <button
                                onClick={() => setActionMode('free-agent')}
                                className="w-full p-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-left hover:border-purple-500/50 hover:bg-gray-800 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Stay Solo (Free Agent)</h3>
                                        <p className="text-gray-400 text-sm">Get matched with a team at the event</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}

                {/* Create Team Confirmation */}
                {actionMode === 'create' && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-3">Create Your Team</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            You&apos;ll become the team captain. Share your team code with up to 3 friends to complete your team.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActionMode('idle')}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTeam}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    'Create Team'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Join Team Form */}
                {actionMode === 'join' && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-3">Join a Team</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Enter the team code shared by your captain.
                        </p>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="RW-0000"
                                maxLength={7}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-center font-mono text-xl tracking-wider focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setActionMode('idle');
                                    setJoinCode('');
                                }}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoinTeam}
                                disabled={isSubmitting || !joinCode.trim()}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    'Join Team'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Free Agent Confirmation */}
                {actionMode === 'free-agent' && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-3">Stay as Free Agent</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            {REWIRE_CONFIG.CUTOFF_TEXT} Our team will help connect you with other free agents at the event.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActionMode('idle')}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleFreeAgent}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    'Confirm Free Agent'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Need help? Contact us at {REWIRE_CONFIG.SUPPORT_CONTACT}
                    </p>
                    <Link
                        href="/rewire/register"
                        className="text-cyan-400 text-sm hover:underline mt-2 inline-block"
                    >
                        Update your profile →
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default function TeamPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
            </div>
        }>
            <TeamContent />
        </Suspense>
    );
}
