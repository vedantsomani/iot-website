"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Send } from 'lucide-react';

type Command = {
    cmd: string;
    output: React.ReactNode;
};

export default function Terminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<Command[]>([
        { cmd: 'init', output: 'IoT_Club_OS v1.0.4 [Authorized Personnel Only]' },
        { cmd: 'status', output: 'System Online. Type "help" for commands.' }
    ]);

    const inputRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    // Toggle on Tilde key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '`' || e.key === '~') {
                e.preventDefault(); // Prevent typing `
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Auto-scroll and focus
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, history]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        let response: React.ReactNode = '';

        switch (cmd) {
            case 'help':
                response = (
                    <div className="space-y-1">
                        <p>Available Commands:</p>
                        <p className="pl-4">- <span className="text-yellow-400">help</span>: Show this message</p>
                        <p className="pl-4">- <span className="text-yellow-400">about</span>: Club mission brief</p>
                        <p className="pl-4">- <span className="text-yellow-400">ls</span>: List current directory</p>
                        <p className="pl-4">- <span className="text-yellow-400">clear</span>: Clear terminal</p>
                        <p className="pl-4">- <span className="text-yellow-400">sudo</span>: Execute admin privileges</p>
                        <p className="pl-4">- <span className="text-yellow-400">cat secret.txt</span>: Read classified file</p>
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'about':
                response = "The IoT & Robotics Club (Bennett University) is a collective of builders, hackers, and creators pushing the boundaries of hardware and software.";
                break;
            case 'whoami':
                response = "Guest User [Level 1 Clearance]";
                break;
            case 'ls':
                response = (
                    <div className="grid grid-cols-2 gap-2 max-w-xs">
                        <span className="text-blue-400">events/</span>
                        <span className="text-blue-400">members/</span>
                        <span className="text-white">secret.txt</span>
                        <span className="text-green-500">run_protocol.exe</span>
                    </div>
                );
                break;
            case 'sudo':
                response = <span className="text-red-500">PERMISSION DENIED. Nice try.</span>;
                break;
            case 'cat secret.txt':
                response = (
                    <div className="text-neon-purple space-y-2">
                        <p>TOP SECRET:</p>
                        <p>Nothing in the Lab Works.</p>
                        <p>Just kidding.</p>
                    </div>
                );
                break;
            case 'cat secret':
                response = "Did you mean 'cat secret.txt'?";
                break;
            case 'matrix':
                response = "Follow the white rabbit... 🐇";
                break;
            case 'exit':
                setIsOpen(false);
                setInput('');
                return;
            default:
                response = <span className="text-red-400">Command not found: {cmd}</span>;
        }

        setHistory(prev => [...prev, { cmd: input, output: response }]);
        setInput('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-0 left-0 w-full h-[50vh] bg-black/95 border-b-2 border-green-500 z-[100] shadow-2xl overflow-hidden backdrop-blur-md font-mono text-sm md:text-base"
                >
                    {/* Header */}
                    <div className="bg-green-900/20 border-b border-green-500/30 p-2 flex justify-between items-center px-4">
                        <div className="flex items-center gap-2 text-green-500">
                            <TerminalIcon className="w-4 h-4" />
                            <span>BASH // IOT_ROOT</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-green-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-4 h-[calc(100%-3rem)] overflow-y-auto custom-scrollbar text-green-400" onClick={() => inputRef.current?.focus()}>
                        <div className="space-y-2">
                            {history.map((item, i) => (
                                <div key={i}>
                                    <div className="flex gap-2 opacity-80">
                                        <span className="text-purple-400">guest@iot-club:~$</span>
                                        <span>{item.cmd}</span>
                                    </div>
                                    <div className="pl-4 mb-2 text-gray-300">{item.output}</div>
                                </div>
                            ))}
                        </div>

                        {/* Input Line */}
                        <form onSubmit={handleCommand} className="flex gap-2 mt-2 items-center">
                            <span className="text-purple-400">guest@iot-club:~$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="bg-transparent border-none outline-none flex-1 text-green-400 placeholder-green-800"
                                autoFocus
                            />
                            <div className="w-2 h-4 bg-green-500 animate-pulse" />
                        </form>
                        <div ref={endRef} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
