'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function StaffLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'username' | 'password'>('username');

    // Terminal typing effect
    const [bootText, setBootText] = useState<string[]>([]);

    useEffect(() => {
        const bootSequence = [
            "INITIALIZING SECURE CONNECTION...",
            "ESTABLISH_HANDSHAKE: [OK]",
            "VERIFYING_ENCRYPTION: [OK]",
            "SYSTEM_READY. ACCESS REQUIRED."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < bootSequence.length) {
                setBootText(prev => [...prev, bootSequence[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 300);

        return () => clearInterval(interval);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (step === 'username' && username) {
            setStep('password');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/staff/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'ACCESS_DENIED');
                setLoading(false);
                setStep('username'); // Reset on failure
                setPassword('');
                return;
            }

            // Success
            router.push('/staff/dashboard');
        } catch (err) {
            setError('NETWORK_ERROR');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex items-center justify-center selection:bg-green-500/30">
            <div className="w-full max-w-lg border border-green-500/30 bg-black shadow-[0_0_20px_rgba(34,197,94,0.1)] p-6 rounded-lg relative overflow-hidden">
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />

                {/* Header */}
                <div className="mb-8 border-b border-green-500/30 pb-4">
                    <h1 className="text-xl font-bold tracking-widest text-start flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        IOT_COMMAND_CENTER
                    </h1>
                    <p className="text-xs text-green-500/60 mt-2">v2.4.0-stable | AUTH_MODULE_LOADED</p>
                </div>

                {/* Boot Sequence */}
                <div className="mb-8 space-y-1 min-h-[100px] text-sm">
                    {bootText.map((line, idx) => (
                        <div key={idx} className="opacity-80">
                            <span className="text-green-500/50">{`>`}</span> {line}
                        </div>
                    ))}
                    {bootText.length === 4 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 border border-green-500/20 p-2 bg-green-500/5 text-xs"
                        >
                            NOTE: UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.
                            ALL ATTEMPTS ARE LOGGED.
                        </motion.div>
                    )}
                </div>

                {/* Login Form */}
                {bootText.length === 4 && (
                    <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
                        <div className="space-y-4">
                            {/* Username Input */}
                            <div className={`transition-opacity duration-300 ${step === 'password' ? 'opacity-50' : 'opacity-100'}`}>
                                <label className="block text-xs uppercase tracking-widest text-green-500/70 mb-1">
                                    Identity_String
                                </label>
                                <div className="flex items-center gap-2 border-b border-green-500/50 py-2">
                                    <span className="text-green-500 font-bold">$</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={step === 'password' || loading}
                                        className="bg-transparent w-full outline-none text-green-400 placeholder-green-500/30 font-bold uppercase"
                                        placeholder="ENTER_USERNAME"
                                        autoComplete="off"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            {step === 'password' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <label className="block text-xs uppercase tracking-widest text-green-500/70 mb-1">
                                        Security_Key
                                    </label>
                                    <div className="flex items-center gap-2 border-b border-green-500/50 py-2">
                                        <span className="text-green-500 font-bold">#</span>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            className="bg-transparent w-full outline-none text-green-400 placeholder-green-500/30 font-bold"
                                            placeholder="ENTER_PASSWORD"
                                            autoFocus
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm font-bold border border-red-500/30 p-2 bg-red-900/10 animate-pulse">
                                [ERROR]: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !username}
                            className="w-full bg-green-500/10 border border-green-500/50 text-green-400 py-3 mt-4 hover:bg-green-500/20 transition-all font-bold uppercase text-sm tracking-widest flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="animate-pulse">AUTHENTICATING...</span>
                            ) : (
                                <>
                                    {step === 'username' ? 'NEXT_STEP' : 'EXECUTE_LOGIN'}
                                    <span className="group-hover:translate-x-1 transition-transform">{`>>`}</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
