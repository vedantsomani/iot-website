'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

interface TicketData {
    teamName: string;
    track: string;
    leadName: string;
    leadEmail: string;
    status: 'PENDING' | 'APPROVED' | 'BLOCKED';
    checkedInAt: string | null;
    checkedInBy: string | null;
    blockReason: string | null;
    registeredAt: string;
}

function TicketContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('t');

    const [ticket, setTicket] = useState<TicketData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [ticketUrl, setTicketUrl] = useState<string>('');

    // Build the ticket URL for QR code
    useEffect(() => {
        if (token && typeof window !== 'undefined') {
            setTicketUrl(`${window.location.origin}/ticket?t=${token}`);
        }
    }, [token]);

    // Fetch ticket data
    useEffect(() => {
        if (!token) {
            setError('No ticket token provided');
            setLoading(false);
            return;
        }

        async function fetchTicket() {
            try {
                const res = await fetch(`/api/ticket?t=${encodeURIComponent(token!)}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Failed to load ticket');
                } else {
                    setTicket(data);
                }
            } catch (err) {
                setError('Failed to load ticket');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchTicket();
    }, [token]);

    const statusColors = {
        PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
        APPROVED: 'bg-green-500/20 text-green-400 border-green-500',
        BLOCKED: 'bg-red-500/20 text-red-400 border-red-500',
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <div className="text-white text-xl">Loading ticket...</div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <div className="bg-red-900/50 border border-red-500 rounded-xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-2">Ticket Not Found</h1>
                    <p className="text-gray-300">{error || 'Invalid ticket'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* Ticket Card */}
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white mb-1">REWIRE 2026</h1>
                        <p className="text-purple-200 text-sm">Event Ticket</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Status Badge */}
                        <div className="flex justify-center">
                            <span className={`px-4 py-2 rounded-full border font-semibold ${statusColors[ticket.status]}`}>
                                {ticket.status}
                            </span>
                        </div>

                        {/* Team Info */}
                        <div className="space-y-3 text-center">
                            <div>
                                <p className="text-gray-400 text-sm">Team Name</p>
                                <p className="text-xl font-bold text-white">{ticket.teamName}</p>
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm">Track</p>
                                <p className="text-lg text-purple-300">{ticket.track}</p>
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm">Team Lead</p>
                                <p className="text-white">{ticket.leadName}</p>
                                <p className="text-gray-400 text-sm">{ticket.leadEmail}</p>
                            </div>
                        </div>

                        {/* Check-in Status */}
                        {ticket.checkedInAt && (
                            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
                                <p className="text-green-400 font-semibold">✓ Checked In</p>
                                <p className="text-gray-400 text-sm">
                                    {new Date(ticket.checkedInAt).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {/* Block Reason */}
                        {ticket.status === 'BLOCKED' && ticket.blockReason && (
                            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center">
                                <p className="text-red-400 font-semibold">Blocked</p>
                                <p className="text-gray-300 text-sm">{ticket.blockReason}</p>
                            </div>
                        )}

                        {/* QR Code */}
                        <div className="flex flex-col items-center pt-4 border-t border-gray-700">
                            <p className="text-gray-400 text-sm mb-3">Scan for check-in</p>
                            <div className="bg-white p-4 rounded-lg min-w-[160px] min-h-[160px] flex items-center justify-center">
                                {ticketUrl ? (
                                    <QRCodeSVG
                                        value={ticketUrl}
                                        size={128}
                                        level="M"
                                        includeMargin={false}
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-200 animate-pulse rounded" />
                                )}
                            </div>
                            {ticketUrl && (
                                <p className="text-gray-500 text-xs mt-2 break-all max-w-full text-center px-4">
                                    {ticketUrl}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-900/50 p-4 text-center">
                        <p className="text-gray-500 text-xs">
                            Registered: {new Date(ticket.registeredAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TicketPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        }>
            <TicketContent />
        </Suspense>
    );
}
