'use client';

import { useState } from 'react';

interface TeamCodeDisplayProps {
    teamCode: string;
    membersCount: number;
    maxMembers: number;
}

export default function TeamCodeDisplay({ teamCode, membersCount, maxMembers }: TeamCodeDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(teamCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = teamCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Join my Rewire team!',
            text: `Join my team for Rewire! Use team code: ${teamCode}`,
            url: `${window.location.origin}/rewire/team?join=${teamCode}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User cancelled or error
            }
        } else {
            // Fallback to copy
            handleCopy();
        }
    };

    const progressPercent = (membersCount / maxMembers) * 100;
    const isComplete = membersCount >= maxMembers;

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center">
            {/* Team Code */}
            <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Your Team Code</p>
                <div className="inline-flex items-center gap-3 bg-gray-900 px-6 py-3 rounded-xl">
                    <span className="text-3xl font-mono font-bold text-cyan-400 tracking-wider">
                        {teamCode}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy code"
                    >
                        {copied ? (
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Team Members</span>
                    <span className={isComplete ? 'text-green-400 font-medium' : 'text-cyan-400'}>
                        {membersCount}/{maxMembers} {isComplete && '✓ Complete'}
                    </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isComplete
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                            }`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    {Array.from({ length: maxMembers }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i < membersCount
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                    : 'bg-gray-700 text-gray-500'
                                }`}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Share Button */}
            {!isComplete && (
                <button
                    onClick={handleShare}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Code with Friends
                </button>
            )}

            {/* Help Text */}
            <p className="text-gray-500 text-xs mt-4">
                {isComplete
                    ? "Your team is complete! See you at Rewire."
                    : "Share this code with friends to invite them to your team."}
            </p>
        </div>
    );
}
