'use client';

import { useState, useEffect } from 'react';

interface ProgressIndicatorProps {
    currentStep: 1 | 2;
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= 1
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                    >
                        {currentStep > 1 ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            '1'
                        )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${currentStep >= 1 ? 'text-cyan-400' : 'text-gray-500'}`}>
                        Profile
                    </span>
                </div>

                {/* Connector Line */}
                <div className="flex-1 mx-4 h-1 rounded-full bg-gray-700 overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 ${currentStep >= 2 ? 'w-full' : 'w-0'
                            }`}
                    />
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= 2
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                    >
                        2
                    </div>
                    <span className={`mt-2 text-xs font-medium ${currentStep >= 2 ? 'text-cyan-400' : 'text-gray-500'}`}>
                        Team
                    </span>
                </div>
            </div>
        </div>
    );
}
