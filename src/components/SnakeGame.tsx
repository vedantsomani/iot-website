"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SnakeGameProps {
    onClose: () => void;
    onScore?: (score: number) => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame({ onClose, onScore }: SnakeGameProps) {
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Position>({ x: 15, y: 10 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [highScore, setHighScore] = useState(0);

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem('snake_highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    // Generate random food position
    const generateFood = useCallback((): Position => {
        let newFood: Position;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }, [snake]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver) {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Restart game
                    setSnake([{ x: 10, y: 10 }]);
                    setFood({ x: 15, y: 10 });
                    setDirection('RIGHT');
                    setGameOver(false);
                    setScore(0);
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

            if (isPaused) return;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (direction !== 'DOWN') setDirection('UP');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (direction !== 'UP') setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (direction !== 'RIGHT') setDirection('LEFT');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (direction !== 'LEFT') setDirection('RIGHT');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, gameOver, isPaused, onClose]);

    // Game loop
    useEffect(() => {
        if (gameOver || isPaused) return;

        const speed = Math.max(50, INITIAL_SPEED - score * 2);

        const gameLoop = setInterval(() => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                let newHead: Position;

                switch (direction) {
                    case 'UP':
                        newHead = { x: head.x, y: head.y - 1 };
                        break;
                    case 'DOWN':
                        newHead = { x: head.x, y: head.y + 1 };
                        break;
                    case 'LEFT':
                        newHead = { x: head.x - 1, y: head.y };
                        break;
                    case 'RIGHT':
                        newHead = { x: head.x + 1, y: head.y };
                        break;
                }

                // Check wall collision
                if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
                    setGameOver(true);
                    if (score > highScore) {
                        setHighScore(score);
                        localStorage.setItem('snake_highscore', score.toString());
                    }
                    onScore?.(score);
                    return prevSnake;
                }

                // Check self collision
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    if (score > highScore) {
                        setHighScore(score);
                        localStorage.setItem('snake_highscore', score.toString());
                    }
                    onScore?.(score);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food collision
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(prev => prev + 10);
                    setFood(generateFood());
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, speed);

        return () => clearInterval(gameLoop);
    }, [direction, food, gameOver, isPaused, score, highScore, generateFood, onScore]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-md"
        >
            <div className="bg-gray-900 border-2 border-green-500 rounded-xl p-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-400 font-orbitron">🐍 SNAKE</h2>
                    <div className="flex gap-4">
                        <span className="text-yellow-400">Score: {score}</span>
                        <span className="text-purple-400">Best: {highScore}</span>
                    </div>
                </div>

                {/* Game Grid */}
                <div
                    className="relative bg-black border border-green-500/50 rounded"
                    style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
                >
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-10">
                        {Array.from({ length: GRID_SIZE }).map((_, i) => (
                            <div key={`h-${i}`} className="absolute w-full h-px bg-green-500" style={{ top: i * CELL_SIZE }} />
                        ))}
                        {Array.from({ length: GRID_SIZE }).map((_, i) => (
                            <div key={`v-${i}`} className="absolute h-full w-px bg-green-500" style={{ left: i * CELL_SIZE }} />
                        ))}
                    </div>

                    {/* Snake */}
                    {snake.map((segment, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`absolute rounded-sm ${index === 0 ? 'bg-green-400' : 'bg-green-600'}`}
                            style={{
                                left: segment.x * CELL_SIZE + 1,
                                top: segment.y * CELL_SIZE + 1,
                                width: CELL_SIZE - 2,
                                height: CELL_SIZE - 2,
                                boxShadow: index === 0 ? '0 0 10px rgba(34,197,94,0.8)' : 'none'
                            }}
                        />
                    ))}

                    {/* Food */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="absolute bg-red-500 rounded-full"
                        style={{
                            left: food.x * CELL_SIZE + 2,
                            top: food.y * CELL_SIZE + 2,
                            width: CELL_SIZE - 4,
                            height: CELL_SIZE - 4,
                            boxShadow: '0 0 15px rgba(239,68,68,0.8)'
                        }}
                    />

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
                    <p>🎮 WASD or Arrow Keys to move | P to pause | ESC to exit</p>
                </div>
            </div>
        </motion.div>
    );
}
