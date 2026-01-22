'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface CheckInResult {
    success: boolean;
    teamName?: string;
    track?: string;
    leadName?: string;
    leadEmail?: string;
    leadMobile?: string;
    member2Name?: string;
    member2Email?: string;
    member3Name?: string;
    member3Email?: string;
    member4Name?: string;
    member4Email?: string;
    checkedInAt?: string;
    error?: string;
    status?: string;
    blockReason?: string;
}

// Matrix rain effect component
function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        function draw() {
            if (!ctx || !canvas) return;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, 0, ${0.5 + Math.random() * 0.5})`;
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const interval = setInterval(draw, 50);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none opacity-30 z-0"
        />
    );
}

// Typewriter text component
function TypewriterText({ text, speed = 30, className = '' }: { text: string; speed?: number; className?: string }) {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        setDisplayText('');
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <span className={className}>
            {displayText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>▌</span>
        </span>
    );
}

// Glitch text component
function GlitchText({ text, className = '' }: { text: string; className?: string }) {
    return (
        <span className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0.5 text-red-500 opacity-70 z-0 animate-pulse">{text}</span>
            <span className="absolute top-0 -left-0.5 text-cyan-500 opacity-70 z-0 animate-pulse" style={{ animationDelay: '0.1s' }}>{text}</span>
        </span>
    );
}

export default function CheckInPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<CheckInResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(false);
    const [lastScannedToken, setLastScannedToken] = useState<string | null>(null);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [showMatrix, setShowMatrix] = useState(true);

    const COOLDOWN_MS = 2000;

    // Add terminal log line
    const addTerminalLine = useCallback((line: string) => {
        setTerminalLines(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${line}`]);
    }, []);

    // Play success sound
    const playSuccessSound = useCallback(() => {
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }, []);

    // Play error sound
    const playErrorSound = useCallback(() => {
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }, []);

    const processCheckIn = useCallback(async (scannedText: string) => {
        if (cooldown) return;

        if (scannedText === lastScannedToken) return;
        setLastScannedToken(scannedText);

        setCooldown(true);
        setTimeout(() => setCooldown(false), COOLDOWN_MS);

        setResult(null);
        setError(null);

        addTerminalLine('> SCANNING QR CODE...');
        addTerminalLine('> EXTRACTING TOKEN DATA...');

        try {
            const res = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scannedText }),
            });

            const data = await res.json();

            addTerminalLine(`> QUERYING DATABASE...`);

            if (!res.ok) {
                addTerminalLine(`> ERROR: ${data.error}`);
                playErrorSound();
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
                addTerminalLine(`> ACCESS GRANTED: ${data.teamName}`);
                addTerminalLine(`> CHECK-IN SUCCESSFUL`);
                playSuccessSound();
                setResult({
                    success: true,
                    teamName: data.teamName,
                    track: data.track,
                    leadName: data.leadName,
                    leadEmail: data.leadEmail,
                    leadMobile: data.leadMobile,
                    member2Name: data.member2Name,
                    member2Email: data.member2Email,
                    member3Name: data.member3Name,
                    member3Email: data.member3Email,
                    member4Name: data.member4Name,
                    member4Email: data.member4Email,
                    checkedInAt: data.checkedInAt,
                });
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
            }
        } catch (err) {
            console.error('Check-in error:', err);
            addTerminalLine('> CONNECTION ERROR');
            playErrorSound();
            setError('Connection error');
        }

        setTimeout(() => setLastScannedToken(null), COOLDOWN_MS * 2);
    }, [cooldown, lastScannedToken, addTerminalLine, playSuccessSound, playErrorSound]);

    useEffect(() => {
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        addTerminalLine('> SYSTEM INITIALIZED');
        addTerminalLine('> AWAITING SCAN INPUT...');

        return () => {
            reader.reset();
        };
    }, [addTerminalLine]);

    async function startScanning() {
        if (!videoRef.current || !readerRef.current) return;

        setScanning(true);
        setError(null);
        setResult(null);
        addTerminalLine('> CAMERA ACTIVATED');
        addTerminalLine('> SCANNING FOR QR CODES...');

        try {
            await readerRef.current.decodeFromVideoDevice(
                null,
                videoRef.current,
                (decodedResult, err) => {
                    if (decodedResult) {
                        const text = decodedResult.getText();
                        processCheckIn(text);
                    }
                    if (err && !(err instanceof NotFoundException)) {
                        console.error('Scan error:', err);
                    }
                }
            );
        } catch (err) {
            console.error('Camera error:', err);
            addTerminalLine('> CAMERA ACCESS DENIED');
            setError('Could not access camera. Please ensure camera permissions are granted.');
            setScanning(false);
        }
    }

    function stopScanning() {
        if (readerRef.current) {
            readerRef.current.reset();
        }
        setScanning(false);
        addTerminalLine('> CAMERA DEACTIVATED');
    }

    function clearResult() {
        setResult(null);
        setError(null);
        addTerminalLine('> READY FOR NEXT SCAN');
    }

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
            {/* Matrix Rain Background */}
            {showMatrix && <MatrixRain />}

            {/* Scanlines overlay */}
            <div className="fixed inset-0 pointer-events-none z-10 opacity-10"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)'
                }}
            />

            <div className="relative z-20 p-4 max-w-md mx-auto">
                {/* Terminal Header */}
                <div className="bg-gray-900/90 border border-green-500/50 rounded-t-lg p-3 flex items-center gap-2">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-green-400 text-sm ml-2">REWIRE_CHECKIN_TERMINAL_v2.0</span>
                </div>

                {/* Terminal Body */}
                <div className="bg-black/90 border-x border-b border-green-500/50 rounded-b-lg p-4">
                    {/* ASCII Art Header */}
                    <pre className="text-green-400 text-xs mb-4 leading-tight">
                        {`╔═══════════════════════════════════╗
║  ██████╗ ███████╗██╗    ██╗██╗██████╗ ███████╗  ║
║  ██╔══██╗██╔════╝██║    ██║██║██╔══██╗██╔════╝  ║
║  ██████╔╝█████╗  ██║ █╗ ██║██║██████╔╝█████╗    ║
║  ██╔══██╗██╔══╝  ██║███╗██║██║██╔══██╗██╔══╝    ║
║  ██║  ██║███████╗╚███╔███╔╝██║██║  ██║███████╗  ║
║  ╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝╚═╝  ╚═╝╚══════╝  ║
║        [ CHECK-IN TERMINAL ]        ║
╚═══════════════════════════════════╝`}
                    </pre>

                    {/* Camera View */}
                    <div className="relative bg-gray-900 rounded border border-green-500/30 mb-4 overflow-hidden">
                        <video
                            ref={videoRef}
                            className={`w-full aspect-square object-cover ${!scanning ? 'hidden' : ''}`}
                            style={{ filter: 'hue-rotate(80deg) saturate(1.5)' }}
                        />

                        {!scanning && (
                            <div className="w-full aspect-square flex items-center justify-center bg-black">
                                <div className="text-center">
                                    <div className="text-green-500 text-6xl mb-4 animate-pulse">◎</div>
                                    <TypewriterText text="CAMERA OFFLINE" className="text-green-400" />
                                </div>
                            </div>
                        )}

                        {scanning && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-4 border-2 border-green-400 rounded animate-pulse"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-400 animate-ping"></div>
                                {cooldown && (
                                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                        <div className="text-green-400 text-lg animate-pulse">PROCESSING...</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Terminal Log */}
                    <div className="bg-gray-900/50 border border-green-500/30 rounded p-2 mb-4 h-32 overflow-y-auto text-xs">
                        {terminalLines.map((line, i) => (
                            <div key={i} className="text-green-400 opacity-80">{line}</div>
                        ))}
                        <div className="text-green-400 animate-pulse">{'>'} _</div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 mb-4">
                        {!scanning ? (
                            <button
                                onClick={startScanning}
                                className="flex-1 py-3 bg-green-900/50 border border-green-500 text-green-400 font-bold rounded hover:bg-green-800/50 transition-all uppercase tracking-wider"
                            >
                                [  INITIATE SCAN  ]
                            </button>
                        ) : (
                            <button
                                onClick={stopScanning}
                                className="flex-1 py-3 bg-red-900/50 border border-red-500 text-red-400 font-bold rounded hover:bg-red-800/50 transition-all uppercase tracking-wider"
                            >
                                [  TERMINATE  ]
                            </button>
                        )}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-900/30 border border-red-500 rounded p-4 mb-4">
                            <GlitchText text="⚠ ERROR" className="text-red-400 font-bold" />
                            <p className="text-red-300 mt-2">{error}</p>
                        </div>
                    )}

                    {/* Result Display */}
                    {result && (
                        <div className={`rounded p-4 mb-4 border ${result.success
                            ? 'bg-green-900/30 border-green-500'
                            : 'bg-red-900/30 border-red-500'
                            }`}>
                            <div className="flex justify-between items-start mb-4">
                                {result.success ? (
                                    <GlitchText text="✓ ACCESS GRANTED" className="text-green-400 text-xl font-bold" />
                                ) : (
                                    <GlitchText text="✗ ACCESS DENIED" className="text-red-400 text-xl font-bold" />
                                )}
                                <button onClick={clearResult} className="text-gray-400 hover:text-white text-xl">×</button>
                            </div>

                            {result.teamName && (
                                <div className="space-y-3">
                                    <div className="border-b border-green-500/30 pb-3">
                                        <div className="text-gray-500 text-xs">SQUAD_IDENTIFIER</div>
                                        <TypewriterText text={result.teamName} className="text-green-400 text-xl font-bold" speed={50} />
                                        {result.track && (
                                            <div className="text-cyan-400 mt-1">[{result.track}]</div>
                                        )}
                                    </div>

                                    <div className="text-left space-y-2">
                                        <div className="text-gray-500 text-xs">SQUAD_ROSTER</div>

                                        {result.leadName && (
                                            <div className="bg-green-900/30 rounded p-2 border-l-2 border-green-400">
                                                <div className="text-green-500 text-xs">LEAD_AGENT</div>
                                                <div className="text-white font-semibold">{result.leadName}</div>
                                                {result.leadEmail && <div className="text-gray-400 text-sm">{result.leadEmail}</div>}
                                                {result.leadMobile && <div className="text-gray-500 text-sm">📱 {result.leadMobile}</div>}
                                            </div>
                                        )}

                                        {result.member2Name && (
                                            <div className="bg-gray-800/50 rounded p-2 border-l-2 border-gray-600">
                                                <div className="text-gray-500 text-xs">AGENT_02</div>
                                                <div className="text-white">{result.member2Name}</div>
                                                {result.member2Email && <div className="text-gray-400 text-sm">{result.member2Email}</div>}
                                            </div>
                                        )}

                                        {result.member3Name && (
                                            <div className="bg-gray-800/50 rounded p-2 border-l-2 border-gray-600">
                                                <div className="text-gray-500 text-xs">AGENT_03</div>
                                                <div className="text-white">{result.member3Name}</div>
                                                {result.member3Email && <div className="text-gray-400 text-sm">{result.member3Email}</div>}
                                            </div>
                                        )}

                                        {result.member4Name && (
                                            <div className="bg-gray-800/50 rounded p-2 border-l-2 border-gray-600">
                                                <div className="text-gray-500 text-xs">AGENT_04</div>
                                                <div className="text-white">{result.member4Name}</div>
                                                {result.member4Email && <div className="text-gray-400 text-sm">{result.member4Email}</div>}
                                            </div>
                                        )}
                                    </div>

                                    {result.success && result.checkedInAt && (
                                        <div className="text-center pt-2 border-t border-green-500/30">
                                            <div className="text-green-400 text-sm">
                                                ✓ TIMESTAMP: {new Date(result.checkedInAt).toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {result.error && (
                                <div className="text-red-300 mt-2 font-mono">&gt; {result.error}</div>
                            )}

                            {result.status === 'BLOCKED' && result.blockReason && (
                                <div className="text-red-300 mt-2 text-sm">BLOCK_REASON: {result.blockReason}</div>
                            )}

                            {result.checkedInAt && !result.success && (
                                <div className="text-yellow-400 mt-2 text-sm">
                                    PREVIOUS_CHECKIN: {new Date(result.checkedInAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Toggle Matrix */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <a href="/staff" className="hover:text-green-400">← LOGOUT</a>
                        <button
                            onClick={() => setShowMatrix(!showMatrix)}
                            className="hover:text-green-400"
                        >
                            [{showMatrix ? 'DISABLE' : 'ENABLE'} MATRIX]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
