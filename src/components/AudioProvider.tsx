"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Howl } from 'howler';

interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playHover: () => void;
    playClick: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within AudioProvider');
    }
    return context;
}

interface AudioProviderProps {
    children: ReactNode;
}

export default function AudioProvider({ children }: AudioProviderProps) {
    const [isMuted, setIsMuted] = useState(true); // Muted by default
    const [sounds, setSounds] = useState<{ hover: Howl | null; click: Howl | null }>({
        hover: null,
        click: null,
    });

    useEffect(() => {
        // Initialize sounds only on client
        // Using simple synthesized sounds to avoid external audio files
        setSounds({
            hover: new Howl({
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQYAj9LjunsaAB2C2O2Bai4AJYXg8ohgKwAqieX3kmEsAC6N6fyWYi4AMZLu/5pkMAAzle//mWQwADOV7v+ZZDAAM5Tu/5hjLwAyku79lWItADCQ6/qSXysALYzo+I5cKQAqiOX1imQlAB2C4PGCYyEAFn7c7H1cGAAPhNbrfV8VAAqCz+V4Xg8ABnzJ4HRbCgAEecTdcVgHAAR3wdtwVQQABHW/2W5TAwAEdL7ZblIDAAN0vdhsUQIAA3O812tQAgADc7zXa08CAAN0vNdrTwIAA3S8121QAgADdb3YblEDAAN2v9lwUwQABHfB23JVCAAFB'],
                volume: 0.1,
            }),
            click: new Howl({
                src: ['data:audio/wav;base64,UklGRl4EAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoEAACAgICAgICAgJGcnJyQfmZVVVVmfoqYnJqMdWJYWGJ1jJqdmopxXVVVXXGLmZqZi3BeVlZecoqZmpmKcV5WVl5xipmamYpxXlZWXnKKmZqZinFeVlZecYqZmpmLcV5VVV5xipmamYtyXlVVXnKKmZqZinFeVlZecoqZmpmKcV5WVl5yipmamYpxXlZWXnKJmJmYiXBdVVVdcImYmZiJcF1VVV1wiZiZmIlwXVVVXXCJmJmYiXBdVVVdcImYmZiJcF1VVV1wiZiZmIlwXVVVXXCJmJmYiW9cVFRccImYmZiJcF1VVV1wiZiZmIlwXVVVXXCJmJmYiXBdVVVdcImYmZiJcF1VVV1wiZhJS'],
                volume: 0.15,
            }),
        });
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => !prev);
    }, []);

    const playHover = useCallback(() => {
        if (!isMuted && sounds.hover) {
            sounds.hover.play();
        }
    }, [isMuted, sounds.hover]);

    const playClick = useCallback(() => {
        if (!isMuted && sounds.click) {
            sounds.click.play();
        }
    }, [isMuted, sounds.click]);

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute, playHover, playClick }}>
            {children}
        </AudioContext.Provider>
    );
}

// Sound toggle button component
export function SoundToggle() {
    const { isMuted, toggleMute } = useAudio();

    return (
        <button
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full glass-panel border border-white/10 hover:border-neon-blue/50 transition-colors group"
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
            {isMuted ? (
                <svg className="w-5 h-5 text-gray-400 group-hover:text-neon-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            )}
        </button>
    );
}
