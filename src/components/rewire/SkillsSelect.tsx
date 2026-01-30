'use client';

import { useState, useRef, useEffect } from 'react';
import { REWIRE_CONFIG } from '@/lib/rewire/config';

interface SkillsSelectProps {
    value: string[];
    onChange: (skills: string[]) => void;
    error?: string;
}

export default function SkillsSelect({ value, onChange, error }: SkillsSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSkill = (skill: string) => {
        if (value.includes(skill)) {
            onChange(value.filter(s => s !== skill));
        } else {
            onChange([...value, skill]);
        }
    };

    const removeSkill = (skill: string) => {
        onChange(value.filter(s => s !== skill));
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Selected Skills Display */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`min-h-[48px] px-4 py-2 bg-gray-800 border rounded-xl cursor-pointer transition-colors ${error ? 'border-red-500' : isOpen ? 'border-cyan-500' : 'border-gray-700 hover:border-gray-600'
                    }`}
            >
                {value.length === 0 ? (
                    <span className="text-gray-500">Select your skills...</span>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {value.map(skill => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-lg"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSkill(skill);
                                    }}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {REWIRE_CONFIG.SKILLS_OPTIONS.map(skill => (
                        <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-700 transition-colors flex items-center justify-between ${value.includes(skill) ? 'text-cyan-400' : 'text-gray-300'
                                }`}
                        >
                            <span>{skill}</span>
                            {value.includes(skill) && (
                                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {error && <p className="mt-1 text-red-400 text-sm">{error}</p>}
        </div>
    );
}
