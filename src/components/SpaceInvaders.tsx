"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

type Position = { x: number; y: number };
type Bullet = Position & { id: number };
type Enemy = Position & { id: number; type: number };
type EnemyBullet = Position & { id: number };

interface SpaceInvadersProps {
    onClose: () => void;
    onScore?: (score: number) => void;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const ENEMY_SIZE = 30;
const BULLET_SIZE = 8;

export default function SpaceInvaders({ onClose, onScore }: SpaceInvadersProps) {
    const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [enemyBullets, setEnemyBullets] = useState<EnemyBullet[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [level, setLevel] = useState(1);
    const [highScore, setHighScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const bulletIdRef = useRef(0);
    const enemyBulletIdRef = useRef(0);
    const keysPressed = useRef<Set<string>>(new Set());

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem('invaders_highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    // Initialize enemies
    const initializeEnemies = useCallback((lvl: number) => {
        const newEnemies: Enemy[] = [];
        const rows = Math.min(3 + Math.floor(lvl / 2), 5);
        const cols = Math.min(6 + lvl, 10);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                newEnemies.push({
                    id: row * cols + col,
                    x: col * (ENEMY_SIZE + 10) + 30,
                    y: row * (ENEMY_SIZE + 10) + 50,
                    type: row % 3
                });
            }
        }
        return newEnemies;
    }, []);

    // Start game
    useEffect(() => {
        setEnemies(initializeEnemies(1));
    }, [initializeEnemies]);

    // Handle keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver) {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Restart
                    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
                    setBullets([]);
                    setEnemyBullets([]);
                    setEnemies(initializeEnemies(1));
                    setScore(0);
                    setLives(3);
                    setLevel(1);
                    setGameOver(false);
                }
                if (e.key === 'Escape') onClose();
                return;
            }

            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key === 'p' || e.key === 'P') {
                setIsPaused(prev => !prev);
                return;
            }

            keysPressed.current.add(e.key);

            if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && !isPaused) {
                setBullets(prev => {
                    if (prev.length < 3) { // Max 3 bullets at a time
                        return [...prev, {
                            id: bulletIdRef.current++,
                            x: playerX + PLAYER_WIDTH / 2 - BULLET_SIZE / 2,
                            y: GAME_HEIGHT - PLAYER_HEIGHT - 30
                        }];
                    }
                    return prev;
                });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameOver, isPaused, playerX, onClose, initializeEnemies]);

    // Player movement
    useEffect(() => {
        if (gameOver || isPaused) return;

        const movePlayer = setInterval(() => {
            if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || keysPressed.current.has('A')) {
                setPlayerX(prev => Math.max(0, prev - 8));
            }
            if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d') || keysPressed.current.has('D')) {
                setPlayerX(prev => Math.min(GAME_WIDTH - PLAYER_WIDTH, prev + 8));
            }
        }, 16);

        return () => clearInterval(movePlayer);
    }, [gameOver, isPaused]);

    // Game loop
    useEffect(() => {
        if (gameOver || isPaused) return;

        const gameLoop = setInterval(() => {
            // Move bullets up
            setBullets(prev => prev.map(b => ({ ...b, y: b.y - 10 })).filter(b => b.y > 0));

            // Move enemy bullets down
            setEnemyBullets(prev => {
                const updated = prev.map(b => ({ ...b, y: b.y + 6 })).filter(b => b.y < GAME_HEIGHT);
                const bulletsToRemove: number[] = [];

                // Check player collision
                updated.forEach(bullet => {
                    if (bullet.x > playerX && bullet.x < playerX + PLAYER_WIDTH &&
                        bullet.y > GAME_HEIGHT - PLAYER_HEIGHT - 20 && bullet.y < GAME_HEIGHT) {
                        bulletsToRemove.push(bullet.id);
                    }
                });

                // Only process if there are hits
                if (bulletsToRemove.length > 0) {
                    setLives(l => {
                        if (l <= 0) return 0; // Already game over
                        const newLives = Math.max(0, l - 1);
                        if (newLives <= 0) {
                            setGameOver(true);
                            if (score > highScore) {
                                setHighScore(score);
                                localStorage.setItem('invaders_highscore', score.toString());
                            }
                            onScore?.(score);
                        }
                        return newLives;
                    });
                }

                return updated.filter(b => !bulletsToRemove.includes(b.id));
            });

            // Move enemies
            setEnemies(prev => {
                if (prev.length === 0) {
                    // Level complete!
                    const newLevel = level + 1;
                    setLevel(newLevel);
                    return initializeEnemies(newLevel);
                }

                const rightMost = Math.max(...prev.map(e => e.x));
                const leftMost = Math.min(...prev.map(e => e.x));
                const speed = 1 + level * 0.5;

                let moveDown = false;
                let newDirection = 1;

                if (rightMost >= GAME_WIDTH - ENEMY_SIZE - 10) {
                    moveDown = true;
                    newDirection = -1;
                } else if (leftMost <= 10) {
                    moveDown = true;
                    newDirection = 1;
                }

                return prev.map(e => ({
                    ...e,
                    x: e.x + speed * (e.x > GAME_WIDTH / 2 ? -newDirection : newDirection),
                    y: moveDown ? e.y + 20 : e.y
                }));
            });

            // Check bullet-enemy collisions
            setBullets(prevBullets => {
                let remainingBullets = [...prevBullets];

                setEnemies(prevEnemies => {
                    return prevEnemies.filter(enemy => {
                        const hit = remainingBullets.some(bullet =>
                            bullet.x > enemy.x && bullet.x < enemy.x + ENEMY_SIZE &&
                            bullet.y > enemy.y && bullet.y < enemy.y + ENEMY_SIZE
                        );

                        if (hit) {
                            remainingBullets = remainingBullets.filter(bullet =>
                                !(bullet.x > enemy.x && bullet.x < enemy.x + ENEMY_SIZE &&
                                    bullet.y > enemy.y && bullet.y < enemy.y + ENEMY_SIZE)
                            );
                            setScore(s => s + (10 * (enemy.type + 1)));
                        }

                        return !hit;
                    });
                });

                return remainingBullets;
            });

            // Enemy shooting
            if (Math.random() < 0.02 * level) {
                setEnemies(prevEnemies => {
                    if (prevEnemies.length > 0) {
                        const shooter = prevEnemies[Math.floor(Math.random() * prevEnemies.length)];
                        setEnemyBullets(prev => [...prev, {
                            id: enemyBulletIdRef.current++,
                            x: shooter.x + ENEMY_SIZE / 2,
                            y: shooter.y + ENEMY_SIZE
                        }]);
                    }
                    return prevEnemies;
                });
            }

        }, 50);

        return () => clearInterval(gameLoop);
    }, [gameOver, isPaused, level, playerX, score, highScore, initializeEnemies, onScore]);

    const getEnemyEmoji = (type: number) => {
        switch (type) {
            case 0: return '👾';
            case 1: return '👽';
            case 2: return '🛸';
            default: return '👾';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-md"
        >
            <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-purple-400 font-orbitron">👾 SPACE INVADERS</h2>
                    <div className="flex gap-4 text-sm">
                        <span className="text-yellow-400">Score: {score}</span>
                        <span className="text-cyan-400">Level: {level}</span>
                        <span className="text-red-400">Lives: {'❤️'.repeat(Math.max(0, lives))}</span>
                        <span className="text-purple-400">Best: {highScore}</span>
                    </div>
                </div>

                {/* Game Area */}
                <div
                    className="relative bg-black border border-purple-500/50 rounded overflow-hidden"
                    style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                >
                    {/* Stars background */}
                    <div className="absolute inset-0 opacity-30">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                style={{
                                    left: Math.random() * GAME_WIDTH,
                                    top: Math.random() * GAME_HEIGHT,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Enemies */}
                    {enemies.map(enemy => (
                        <div
                            key={enemy.id}
                            className="absolute text-2xl transition-all duration-100"
                            style={{ left: enemy.x, top: enemy.y }}
                        >
                            {getEnemyEmoji(enemy.type)}
                        </div>
                    ))}

                    {/* Player bullets */}
                    {bullets.map(bullet => (
                        <motion.div
                            key={bullet.id}
                            className="absolute bg-cyan-400 rounded-full"
                            style={{
                                left: bullet.x,
                                top: bullet.y,
                                width: BULLET_SIZE,
                                height: BULLET_SIZE * 2,
                                boxShadow: '0 0 10px rgba(34,211,238,0.8)'
                            }}
                        />
                    ))}

                    {/* Enemy bullets */}
                    {enemyBullets.map(bullet => (
                        <motion.div
                            key={bullet.id}
                            className="absolute bg-red-500 rounded-full"
                            style={{
                                left: bullet.x,
                                top: bullet.y,
                                width: BULLET_SIZE,
                                height: BULLET_SIZE * 2,
                                boxShadow: '0 0 10px rgba(239,68,68,0.8)'
                            }}
                        />
                    ))}

                    {/* Player */}
                    <div
                        className="absolute text-3xl transition-all duration-50"
                        style={{
                            left: playerX,
                            bottom: 20,
                            filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.8))'
                        }}
                    >
                        🚀
                    </div>

                    {/* Pause overlay */}
                    {isPaused && !gameOver && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-yellow-400 text-2xl font-bold animate-pulse">PAUSED</p>
                                <p className="text-gray-400 text-sm mt-2">Press P to resume</p>
                            </div>
                        </div>
                    )}

                    {/* Game Over overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-red-500 text-3xl font-bold">GAME OVER</p>
                                <p className="text-yellow-400 text-xl mt-2">Score: {score}</p>
                                <p className="text-cyan-400 mt-1">Level: {level}</p>
                                {score >= highScore && score > 0 && (
                                    <p className="text-green-400 animate-pulse mt-1">🏆 NEW HIGH SCORE!</p>
                                )}
                                <p className="text-gray-400 text-sm mt-4">Press ENTER to restart</p>
                                <p className="text-gray-500 text-xs">Press ESC to exit</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="mt-4 text-center text-gray-400 text-xs">
                    <p>🎮 A/D or ← → to move | SPACE or W to shoot | P to pause | ESC to exit</p>
                </div>
            </div>
        </motion.div>
    );
}
