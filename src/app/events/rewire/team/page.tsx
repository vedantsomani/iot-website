"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, User, Shield, CheckCircle, Copy, Check, AlertTriangle } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import ParticleBackground from "@/components/ParticleBackground";
import { Section } from "@/components/ui/Section";

type ActionMode = 'idle' | 'create' | 'join' | 'free-agent';

interface StatusResponse {
    participant: {
        participant_id: string;
        name: string;
        email: string;
        status: 'PROFILE_ONLY' | 'CAPTAIN' | 'MEMBER' | 'FREE_AGENT' | 'CANCELLED';
    };
    team?: {
        team_code: string;
        members_count: number;
    };
    team_members?: Array<{ name: string; email: string }>;
}

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
    const [copied, setCopied] = useState(false);

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
                setSuccessMessage('Squad created successfully! Share your code with allies.');
                await fetchStatus();
                setActionMode('idle');
            } else {
                setError(result.message || 'Failed to create squad');
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
                setSuccessMessage('Successfully joined the squad!');
                await fetchStatus();
                setActionMode('idle');
                setJoinCode('');
            } else {
                setError(result.message || 'Failed to join squad');
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
                setSuccessMessage("You're now a free agent. We'll help you find a squad at the event!");
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

    // Copy team code
    const copyTeamCode = () => {
        if (status?.team?.team_code) {
            navigator.clipboard.writeText(status.team.team_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Status badge
    const renderStatusBadge = (participantStatus: string) => {
        const badges: Record<string, { text: string; className: string }> = {
            PROFILE_ONLY: { text: 'Unassigned', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
            CAPTAIN: { text: 'Squad Leader', className: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30' },
            MEMBER: { text: 'Squad Member', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
            FREE_AGENT: { text: 'Free Agent', className: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30' },
            CANCELLED: { text: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' }
        };

        const badge = badges[participantStatus] || badges.PROFILE_ONLY;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono border ${badge.className}`}>
                {badge.text}
            </span>
        );
    };

    // No participant ID - redirect to register
    if (!isLoading && !participantId) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <ParticleBackground />
                <div className="text-center p-8 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold font-orbitron mb-4">ACCESS DENIED</h1>
                    <p className="text-gray-400 mb-6">Agent registration required before squad assignment.</p>
                    <Button asChild className="bg-neon-blue text-black hover:bg-white">
                        <a href="/events/rewire">
                            Go to Registration
                        </a>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white relative">
            <ParticleBackground />

            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 z-30">
                <Button variant="ghost" asChild className="text-gray-400 hover:text-white">
                    <a href="/events/rewire">← Back to Mission Briefing</a>
                </Button>
            </div>

            <Section className="pt-24 relative z-20">
                <Container className="max-w-lg">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold font-orbitron text-white mb-2">
                            SQUAD <span className="text-neon-blue">SETUP</span>
                        </h1>
                        <p className="text-gray-400">
                            Choose your path, Agent
                        </p>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full" />
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Banner */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Status Card */}
                    {!isLoading && status?.participant && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-6 rounded-2xl border border-white/10 mb-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="font-medium text-white font-orbitron">{status.participant.name}</h2>
                                    <p className="text-gray-400 text-sm font-mono">{status.participant.email}</p>
                                </div>
                                {renderStatusBadge(status.participant.status)}
                            </div>

                            {/* Team Code Display */}
                            {status.team && (
                                <div className="mt-4 p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Squad Access Code</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-mono font-bold text-neon-blue tracking-wider">
                                            {status.team.team_code}
                                        </span>
                                        <button
                                            onClick={copyTeamCode}
                                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                        >
                                            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {status.team.members_count}/4 Agents Enlisted
                                    </p>
                                </div>
                            )}

                            {/* Team Members */}
                            {status.team && status.team_members && status.team_members.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <h3 className="text-xs font-mono text-gray-400 mb-3 uppercase tracking-widest">Squad Roster</h3>
                                    <div className="space-y-2">
                                        {status.team_members.map((member, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-medium">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white">{member.name}</p>
                                                    <p className="text-gray-500 text-xs font-mono">{member.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Action Cards - Only show if no team and not free agent */}
                    {!isLoading && status?.participant &&
                        status.participant.status === 'PROFILE_ONLY' &&
                        actionMode === 'idle' && (
                            <div className="space-y-4">
                                {/* Create Team */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActionMode('create')}
                                    className="w-full p-5 glass-panel border border-white/10 rounded-2xl text-left hover:border-neon-blue/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center group-hover:bg-neon-blue/30 transition-colors">
                                            <UserPlus className="w-6 h-6 text-neon-blue" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white font-orbitron">CREATE SQUAD</h3>
                                            <p className="text-gray-400 text-sm">Start a new squad and recruit allies</p>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Join Team */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActionMode('join')}
                                    className="w-full p-5 glass-panel border border-white/10 rounded-2xl text-left hover:border-neon-purple/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center group-hover:bg-neon-purple/30 transition-colors">
                                            <Users className="w-6 h-6 text-neon-purple" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white font-orbitron">JOIN SQUAD</h3>
                                            <p className="text-gray-400 text-sm">Enter access code to join existing squad</p>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Free Agent */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActionMode('free-agent')}
                                    className="w-full p-5 glass-panel border border-white/10 rounded-2xl text-left hover:border-green-500/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                            <User className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white font-orbitron">STAY SOLO</h3>
                                            <p className="text-gray-400 text-sm">Get matched with a squad at the event</p>
                                        </div>
                                    </div>
                                </motion.button>
                            </div>
                        )}

                    {/* Create Team Confirmation */}
                    <AnimatePresence>
                        {actionMode === 'create' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-panel border border-white/10 rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-semibold font-orbitron mb-3">CREATE YOUR SQUAD</h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    You&apos;ll become the squad leader. Share your access code with up to 3 allies to complete your squad.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setActionMode('idle')}
                                        disabled={isSubmitting}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateTeam}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-neon-blue text-black hover:bg-white"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Squad'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Join Team Form */}
                        {actionMode === 'join' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-panel border border-white/10 rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-semibold font-orbitron mb-3">JOIN A SQUAD</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Enter the access code shared by your squad leader.
                                </p>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                        placeholder="RW-0000"
                                        maxLength={7}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-center font-mono text-xl tracking-wider focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(189,0,255,0.3)] uppercase"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            setActionMode('idle');
                                            setJoinCode('');
                                        }}
                                        disabled={isSubmitting}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleJoinTeam}
                                        disabled={isSubmitting || !joinCode.trim()}
                                        className="flex-1 bg-neon-purple text-white hover:bg-white hover:text-black"
                                    >
                                        {isSubmitting ? 'Joining...' : 'Join Squad'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Free Agent Confirmation */}
                        {actionMode === 'free-agent' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-panel border border-white/10 rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-semibold font-orbitron mb-3">STAY AS FREE AGENT</h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    Our team will help connect you with other free agents at the event. Squads can be formed during the first day.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setActionMode('idle')}
                                        disabled={isSubmitting}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Go Back
                                    </Button>
                                    <Button
                                        onClick={handleFreeAgent}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-green-600 text-white hover:bg-green-500"
                                    >
                                        {isSubmitting ? 'Confirming...' : 'Confirm Free Agent'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>


                </Container>
            </Section>
        </div>
    );
}

export default function TeamPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full" />
            </div>
        }>
            <TeamContent />
        </Suspense>
    );
}
