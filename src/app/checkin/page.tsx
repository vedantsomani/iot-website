'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface CheckInResult {
    success: boolean;
    teamName?: string;
    track?: string;
    leadName?: string;
    checkedInAt?: string;
    error?: string;
    status?: string;
    blockReason?: string;
}

export default function CheckInPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<CheckInResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(false);
    const [lastScannedToken, setLastScannedToken] = useState<string | null>(null);

    const COOLDOWN_MS = 2000; // 2 second cooldown between scans

    const processCheckIn = useCallback(async (scannedText: string) => {
        if (cooldown) return;

        // Prevent duplicate scans of the same token
        if (scannedText === lastScannedToken) return;
        setLastScannedToken(scannedText);

        // Start cooldown
        setCooldown(true);
        setTimeout(() => setCooldown(false), COOLDOWN_MS);

        setResult(null);
        setError(null);

        try {
            const res = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scannedText }),
            });

            const data = await res.json();

            if (!res.ok) {
                setResult({
                    success: false,
                    error: data.error,
                    teamName: data.teamName,
                    track: data.track,
                    status: data.status,
                    blockReason: data.blockReason,
                    checkedInAt: data.checkedInAt,
                });
            } else {
                setResult({
                    success: true,
                    teamName: data.teamName,
                    track: data.track,
                    leadName: data.leadName,
                    checkedInAt: data.checkedInAt,
                });
                // Play success sound or vibrate
                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }
            }
        } catch (err) {
            console.error('Check-in error:', err);
            setError('Connection error');
        }

        // Clear the last scanned token after cooldown to allow re-scanning
        setTimeout(() => setLastScannedToken(null), COOLDOWN_MS * 2);
    }, [cooldown, lastScannedToken]);

    useEffect(() => {
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        return () => {
            reader.reset();
        };
    }, []);

    async function startScanning() {
        if (!videoRef.current || !readerRef.current) return;

        setScanning(true);
        setError(null);
        setResult(null);

        try {
            await readerRef.current.decodeFromVideoDevice(
                null, // Use default camera
                videoRef.current,
                (decodedResult, err) => {
                    if (decodedResult) {
                        const text = decodedResult.getText();
                        processCheckIn(text);
                    }
                    if (err && !(err instanceof NotFoundException)) {
                        // NotFoundException is expected when no QR is in view
                        console.error('Scan error:', err);
                    }
                }
            );
        } catch (err) {
            console.error('Camera error:', err);
            setError('Could not access camera. Please ensure camera permissions are granted.');
            setScanning(false);
        }
    }

    function stopScanning() {
        if (readerRef.current) {
            readerRef.current.reset();
        }
        setScanning(false);
    }

    function clearResult() {
        setResult(null);
        setError(null);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Check-In Scanner</h1>
                    <p className="text-gray-400">Scan participant QR codes</p>
                </div>

                {/* Camera View */}
                <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-purple-500/30 mb-6">
                    <video
                        ref={videoRef}
                        className={`w-full aspect-square object-cover ${!scanning ? 'hidden' : ''}`}
                    />

                    {!scanning && (
                        <div className="w-full aspect-square flex items-center justify-center bg-gray-900">
                            <div className="text-center">
                                <svg
                                    className="w-16 h-16 text-gray-600 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <p className="text-gray-500">Camera inactive</p>
                            </div>
                        </div>
                    )}

                    {/* Scanning overlay */}
                    {scanning && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-8 border-2 border-purple-400 rounded-lg"></div>
                            {cooldown && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="text-white text-lg">Processing...</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-6">
                    {!scanning ? (
                        <button
                            onClick={startScanning}
                            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            Start Scanning
                        </button>
                    ) : (
                        <button
                            onClick={stopScanning}
                            className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                        >
                            Stop Scanning
                        </button>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6">
                        <p className="text-red-400 text-center">{error}</p>
                    </div>
                )}

                {/* Result Display */}
                {result && (
                    <div
                        className={`rounded-xl p-6 mb-6 ${result.success
                            ? 'bg-green-900/30 border border-green-500/30'
                            : 'bg-red-900/30 border border-red-500/30'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className={`text-2xl font-bold ${result.success ? 'text-green-400' : 'text-red-400'
                                    }`}
                            >
                                {result.success ? '✓ Check-In Success' : '✗ Check-In Failed'}
                            </div>
                            <button
                                onClick={clearResult}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {result.teamName && (
                            <div className="space-y-2">
                                <p className="text-white text-lg font-semibold">{result.teamName}</p>
                                {result.track && <p className="text-gray-300">{result.track}</p>}
                                {result.leadName && (
                                    <p className="text-gray-400 text-sm">Lead: {result.leadName}</p>
                                )}
                            </div>
                        )}

                        {result.error && (
                            <p className="text-gray-300 mt-2">{result.error}</p>
                        )}

                        {result.status === 'BLOCKED' && result.blockReason && (
                            <p className="text-red-300 mt-2 text-sm">Reason: {result.blockReason}</p>
                        )}

                        {result.checkedInAt && !result.success && (
                            <p className="text-gray-400 mt-2 text-sm">
                                Already checked in: {new Date(result.checkedInAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}

                {/* Back to Login */}
                <div className="text-center">
                    <a
                        href="/staff"
                        className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                        ← Back to Staff Login
                    </a>
                </div>
            </div>
        </div>
    );
}
