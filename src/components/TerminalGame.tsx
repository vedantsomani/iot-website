"use client";

import { useState, useEffect, useRef } from 'react';

type GameState = 'START' | 'PLAYING' | 'GAME_OVER' | 'WIN';

interface TerminalGameProps {
    onExit: () => void;
}

export default function TerminalGame({ onExit }: TerminalGameProps) {
    const [gameState, setGameState] = useState<GameState>('START');
    const [score, setScore] = useState(0);
    const [input, setInput] = useState('');
    const [words, setWords] = useState<{ text: string, x: number, y: number }[]>([]);
    const [health, setHealth] = useState(100);

    const canvasRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);

    // Word bank
    const WORD_BANK = [
        'SYSTEM', 'HACK', 'BREACH', 'FIREWALL', 'ACCESS', 'DENIED',
        'SERVER', 'PROXY', 'ENCRYPT', 'DECRYPT', 'MAINFRAME', 'ROOT',
        'KERNEL', 'BUFFER', 'STACK', 'HEAP', 'LINUX', 'PYTHON', 'REACT',
        'NODES', 'ROBOT', 'DRONE', 'IOT', 'SENSORS', 'CIRCUIT', 'ARDUINO'
    ];

    const spawnWord = () => {
        const text = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
        const x = Math.random() * 80; // percentage
        setWords(prev => [...prev, { text, x, y: 0 }]);
    };

    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const interval = setInterval(() => {
            // Move words down
            setWords(prev => {
                const newWords: typeof words = [];
                let damage = 0;

                prev.forEach(w => {
                    if (w.y > 90) {
                        damage += 10;
                    } else {
                        newWords.push({ ...w, y: w.y + 1 }); // speed
                    }
                });

                if (damage > 0) {
                    setHealth(h => {
                        const newH = Math.max(0, h - damage);
                        if (newH <= 0) setGameState('GAME_OVER');
                        return newH;
                    });
                }

                // Spawn new word logic
                if (Math.random() > 0.95 && prev.length < 5) { // spawn rate
                    const text = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
                    const x = Math.random() * 80;
                    newWords.push({ text, x, y: 0 });
                }

                return newWords;
            });
        }, 100); // Game tick

        return () => clearInterval(interval);
    }, [gameState]);

    // Win/Loss checks moved inline to avoid setState in effect
    const checkGameOver = (newHealth: number) => {
        if (newHealth <= 0) setGameState('GAME_OVER');
    };
    const checkWin = (newScore: number) => {
        if (newScore >= 500) setGameState('WIN');
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setInput(val);

        setWords(prev => {
            const matchIndex = prev.findIndex(w => w.text === val);
            if (matchIndex !== -1) {
                // Word matched
                setInput('');
                setScore(s => {
                    const newS = s + 50;
                    if (newS >= 500) setGameState('WIN');
                    return newS;
                });
                return prev.filter((_, i) => i !== matchIndex);
            }
            return prev;
        });
    };

    const startGame = () => {
        setScore(0);
        setHealth(100);
        setWords([]);
        setGameState('PLAYING');
        spawnWord();
    };

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden font-mono bg-black/50 p-4 border border-green-500 rounded">
            {/* HUD */}
            <div className="flex justify-between border-b border-green-500 pb-2 mb-2">
                <div className="text-green-400">SCORE: {score}</div>
                <div className={`${health < 30 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>INTEGRITY: {health}%</div>
                <button onClick={onExit} className="text-red-500 border border-red-500 px-2 text-xs hover:bg-red-500 hover:text-black">ABORT</button>
            </div>

            {/* Game Area */}
            <div className="flex-1 relative" ref={canvasRef}>
                {gameState === 'START' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <h2 className="text-2xl text-green-500 font-bold mb-4">DEFEND MAINFRAME</h2>
                        <p className="text-green-300 text-sm mb-4">Type the falling keywords to stop the breach.</p>
                        <button onClick={startGame} className="bg-green-600 text-black px-4 py-2 hover:bg-green-500 font-bold">INITIATE DEFENSE</button>
                    </div>
                )}

                {gameState === 'GAME_OVER' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/80 z-10">
                        <h2 className="text-4xl text-red-600 font-bold mb-4">SYSTEM BREACHED</h2>
                        <p className="text-red-400 mb-4">Final Score: {score}</p>
                        <button onClick={startGame} className="border border-red-600 text-red-600 px-4 py-2 hover:bg-red-600 hover:text-black mr-2">RETRY</button>
                        <button onClick={onExit} className="text-gray-400 mt-4 underline text-sm">Return to Terminal</button>
                    </div>
                )}

                {gameState === 'WIN' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/80 z-10">
                        <h2 className="text-4xl text-blue-400 font-bold mb-4">THREAT NEUTRALIZED</h2>
                        <p className="text-blue-200 mb-4">Bonus Granted: 500 XP</p>
                        <button onClick={onExit} className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-500">RETURN TO SYSTEM</button>
                    </div>
                )}

                {gameState === 'PLAYING' && words.map((w, i) => (
                    <div
                        key={i}
                        className="absolute text-green-300 font-bold transition-all duration-100"
                        style={{ left: `${w.x}%`, top: `${w.y}%` }}
                    >
                        {w.text}
                    </div>
                ))}
            </div>

            {/* Input */}
            {gameState === 'PLAYING' && (
                <div className="mt-2 border-t border-green-500 pt-2">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInput}
                        className="w-full bg-transparent border-none text-green-400 font-bold outline-none uppercase"
                        placeholder="TYPE COMMAND..."
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
}
