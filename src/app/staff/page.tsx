'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffLoginPage() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/staff/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            // Success - redirect to check-in page
            router.push('/checkin');
        } catch (err) {
            setError('Connection error');
            console.error(err);
            setLoading(false);
        }
    }

    function handlePinChange(value: string) {
        // Only allow digits
        const digits = value.replace(/\D/g, '').slice(0, 6);
        setPin(digits);
        setError(null);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 px-4">
            <div className="w-full max-w-sm">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Staff Login</h1>
                        <p className="text-gray-400 mt-2">Enter your PIN to access check-in</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="pin" className="block text-sm font-medium text-gray-300 mb-2">
                                Staff PIN
                            </label>
                            <input
                                id="pin"
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={pin}
                                onChange={(e) => handlePinChange(e.target.value)}
                                placeholder="Enter PIN"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest placeholder:text-gray-600 placeholder:text-base placeholder:tracking-normal focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
                                autoComplete="off"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-center">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || pin.length === 0}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
