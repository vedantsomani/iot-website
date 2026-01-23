"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import BirthdaySurprise from './BirthdaySurprise';
import MatrixRain from './MatrixRain';
import members from '../data/members.json';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import TerminalGame from './TerminalGame';



type Command = {
    cmd: string;
    output: React.ReactNode;
    user: string;
};

export default function Terminal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<Command[]>([
        { cmd: 'init', output: 'IoT_Club_OS v1.0.4 [Authorized Personnel Only]', user: 'root' },
        { cmd: 'status', output: 'System Online. Type "help" for commands.', user: 'root' }

    ]);

    const [theme, setTheme] = useState('green-500'); // green, cyan, pink, red, yellow

    const [showSurprise, setShowSurprise] = useState(false);
    const [isHacking, setIsHacking] = useState(false);
    const [isPlayingGame, setIsPlayingGame] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('guest');



    const inputRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const usernameRef = useRef(username); // Ref to track username for event listeners

    // Keep ref in sync
    useEffect(() => {
        usernameRef.current = username;
    }, [username]);

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

    // Check auth status & subscribe to messages
    useEffect(() => {
        const updateUser = (sessionUser: User | null) => {
            setUser(sessionUser);
            const newName = sessionUser?.user_metadata?.username || sessionUser?.email?.split('@')[0] || 'user';
            const finalName = sessionUser ? newName : 'guest';
            setUsername(finalName);
            usernameRef.current = finalName;
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            updateUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            updateUser(session?.user ?? null);
        });

        // Realtime subscription
        const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new;
                const content = newMsg.content;

                // Handle Private Messages
                if (content.startsWith('[PRIVATE to ')) {
                    const match = content.match(/^\[PRIVATE to (.*?)\]: (.*)$/);
                    if (match) {
                        const target = match[1];
                        const privateMsg = match[2];
                        // Only show if sent BY me or TO me
                        const amISender = newMsg.email === user?.email; // This user state might be stale too, need ref? 
                        // Actually better to rely on username check for simplicity or just show if it matches my username.
                        // We will check against usernameRef.current
                        if (target.toLowerCase() === usernameRef.current.toLowerCase()) {
                            setHistory(prev => [...prev, {
                                cmd: 'INCOMING_TRANSMISSION',
                                output: <span className="text-pink-500 font-bold">[{newMsg.email?.split('@')[0]} whispers]: {privateMsg}</span>,
                                user: 'system'
                            }]);
                        }
                    }
                    return;
                }

                // Public Messages
                setHistory(prev => [...prev, {
                    cmd: 'INCOMING_TRANSMISSION',
                    output: <span className="text-cyan-400">[{newMsg.email?.split('@')[0]}]: {content}</span>,
                    user: 'system'
                }]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, []);

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim();
        if (!cmd) return;

        const cmdLower = cmd.toLowerCase();
        let response: React.ReactNode = '';

        const addHistory = (output: React.ReactNode) => {
            setHistory(prev => [...prev, { cmd: input, output, user: username }]);
        };

        switch (cmdLower) {
            case 'help':
                response = (
                    <div className="space-y-1">
                        <p>Available Commands:</p>
                        <p className="pl-4">- <span className="text-yellow-400">help</span>: Show this message</p>
                        <p className="pl-4">- <span className="text-yellow-400">about</span>: Club information</p>
                        <p className="pl-4">- <span className="text-yellow-400">login &lt;email&gt; &lt;pass&gt;</span>: Authenticate</p>
                        <p className="pl-4">- <span className="text-yellow-400">signup &lt;email&gt; &lt;pass&gt; [name]</span>: Create account</p>
                        <p className="pl-4">- <span className="text-yellow-400">logout</span>: End session</p>
                        <p className="pl-4">- <span className="text-yellow-400">chat &lt;msg&gt;</span>: Broadcast to secure channel</p>
                        <p className="pl-4">- <span className="text-yellow-400">msg &lt;user&gt;</span>: Send encrypted transmission</p>
                        <p className="pl-4">- <span className="text-yellow-400">nick &lt;name&gt;</span>: Change terminal codename</p>
                        <p className="pl-4">- <span className="text-yellow-400">theme &lt;color&gt;</span>: Change UI theme (green, red, pink, etc)</p>
                        <p className="pl-4">- <span className="text-yellow-400">whoami</span>: Current user status</p>
                        <p className="pl-4">- <span className="text-yellow-400">whois &lt;name&gt;</span>: Query member database</p>
                        <p className="pl-4">- <span className="text-yellow-400">ls</span>: List current directory</p>
                        <p className="pl-4">- <span className="text-yellow-400">clear</span>: Clear terminal</p>
                        <p className="pl-4">- <span className="text-yellow-400">sudo</span>: Execute admin privileges</p>
                        <p className="pl-4">- <span className="text-yellow-400">hack</span>: Initialize matrix protocol</p>
                        <p className="pl-4">- <span className="text-yellow-400">twin</span>: Access 3D Model Viewer</p>
                        <p className="pl-4">- <span className="text-yellow-400">game</span>: Launch firewall defense protocol</p>
                        <p className="pl-4">- <span className="text-yellow-400">leaderboard</span>: View global hacker rankings</p>
                        <p className="pl-4">- <span className="text-yellow-400">submit &lt;code&gt;</span>: Verify security clearance key</p>
                        <p className="pl-4">- <span className="text-yellow-400">level</span>: Check current clearance status</p>
                        <p className="pl-4">- <span className="text-yellow-400">cat secret.txt</span>: Read classified file</p>
                        <p className="pl-4">- <span className="text-red-500">selfdestruct</span>: <span className="animate-pulse">DO NOT EXECUTE</span></p>
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
                response = user
                    ? <span className="text-cyan-400">Logged in as: {user.email} [Level 3 Clearance]</span>
                    : "Guest User [Level 1 Clearance]";
                break;
            case 'logout':
                await supabase.auth.signOut();
                response = "Logged out successfully.";
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
                if (isHacking) {
                    setIsHacking(false);
                    response = "Matrix protocol terminated.";
                } else {
                    setIsOpen(false);
                }
                setInput('');
                return;
            case 'hack':
                setIsHacking(prev => !prev);
                response = isHacking ? "Matrix protocol deactivated." : "Initializing Matrix protocol... Accessing mainframe...";
                break;
            case 'best':
            case 'president':
            case 'birthday':
            case 'Rudrakshi Rai':
            case 'rudrakshi rai':
                setShowSurprise(true);
                response = <span className="text-yellow-400 font-bold uppercase tracking-widest animate-pulse">CRITICAL OVERRIDE: Birthday Surprise Protocol Initiated!</span>;
                break;
            case 'twin':
                addHistory(<span className="text-cyan-400">Accessing Digital Twin interface... CONNECTING...</span>);
                setTimeout(() => router.push('/twin'), 1000);
                break;
            case 'game':
                setIsPlayingGame(true);
                response = "Initializing Firewall Defense Protocol...";
                break;
            case 'submit':
                response = "Usage: submit <code_key>";
                break;
            case 'level':
                const currentLevel = parseInt(localStorage.getItem('iot_clearance_level') || '1');
                response = (
                    <div className="border border-green-500 p-2 max-w-xs">
                        <h3 className="text-green-400 font-bold border-b border-green-500 mb-2">ACCESS CARD</h3>
                        <p>IDENTITY: {username}</p>
                        <p>CLEARANCE: LEVEL {currentLevel}</p>
                        <div className="w-full bg-gray-700 h-2 mt-2">
                            <div className="bg-green-500 h-full" style={{ width: `${(currentLevel / 5) * 100}%` }} />
                        </div>
                    </div>
                );
                break;

            default:
                // Scavenger Hunt Check
                if (cmdLower.startsWith('submit ')) {
                    const code = cmdLower.replace('submit ', '').trim();
                    const VALID_CODES = {
                        'iot_rulez': 2,
                        'matrix_master': 3,
                        'konami_god': 4,
                        'sys_admin': 5
                    };

                    const level = VALID_CODES[code as keyof typeof VALID_CODES];
                    if (level) {
                        const current = parseInt(localStorage.getItem('iot_clearance_level') || '1');
                        if (level > current) {
                            localStorage.setItem('iot_clearance_level', level.toString());
                            response = <span className="text-yellow-400 font-bold animate-pulse">ACCESS GRANTED. CLEARANCE UPDATED TO LEVEL {level}.</span>;
                        } else {
                            response = <span className="text-blue-400">Code Accepted. You already have this clearance.</span>;
                        }
                    } else {
                        response = <span className="text-red-500">ACCESS DENIED. Invalid security key.</span>;
                    }
                    addHistory(response);
                    setInput('');
                    return;
                }

                // Handle complex commands
                if (cmdLower.startsWith('whois ')) {
                    const query = cmdLower.replace('whois ', '').trim();
                    const results = members.filter(m =>
                        m.name.toLowerCase().includes(query) ||
                        m.id.toLowerCase().includes(query) ||
                        m.role.toLowerCase().includes(query)
                    );

                    if (results.length > 0) {
                        response = (
                            <div className="space-y-4">
                                <p className="text-blue-400">Found {results.length} record(s):</p>
                                {results.map(m => (
                                    <div key={m.id} className="border-l-2 border-green-500 pl-4 py-1">
                                        <p><span className="text-yellow-400">Name:</span> {m.name}</p>
                                        <p><span className="text-yellow-400">Role:</span> {m.role} ({m.team})</p>
                                        <p><span className="text-yellow-400">Bio:</span> {m.bio}</p>
                                    </div>
                                ))}
                            </div>
                        );
                    } else {
                        response = <span className="text-red-400">No records found for query: &quot;{query}&quot;</span>;
                    }
                    addHistory(response);
                    setInput('');
                    return;
                }

                if (cmdLower.startsWith('login ')) {
                    const parts = cmd.split(' ');
                    if (parts.length < 3) {
                        response = <span className="text-red-400">Usage: login &lt;email&gt; &lt;password&gt;</span>;
                    } else {
                        addHistory("Authenticating...");
                        const { error } = await supabase.auth.signInWithPassword({
                            email: parts[1],
                            password: parts[2]
                        });
                        response = error ? <span className="text-red-500">Error: {error.message}</span> : <span className="text-green-500">Access Granted. Welcome back, Agent.</span>;
                    }
                    addHistory(response);
                    setInput('');
                    return;
                }

                if (cmdLower.startsWith('theme ')) {
                    const color = cmdLower.replace('theme ', '').trim();
                    const validThemes: Record<string, string> = {
                        'green': 'green-500',
                        'cyan': 'cyan-400',
                        'pink': 'pink-500',
                        'red': 'red-500',
                        'yellow': 'yellow-400',
                        'purple': 'violet-500'
                    };

                    if (validThemes[color]) {
                        setTheme(validThemes[color]);
                        response = <span className={`text-${validThemes[color]}`}>Theme updated to {color}.</span>;
                    } else {
                        response = <span className="text-red-400">Invalid theme. Try: green, cyan, pink, red, yellow, purple.</span>;
                    }
                    addHistory(response);
                    setInput('');
                    return;
                }

                if (cmdLower === 'selfdestruct') {
                    addHistory(<span className="text-red-600 font-bold animate-pulse">WARNING: SELF-DESTRUCT SEQUENCE INITIATED...</span>);
                    setTimeout(() => addHistory(<span className="text-red-600">3...</span>), 1000);
                    setTimeout(() => addHistory(<span className="text-red-600">2...</span>), 2000);
                    setTimeout(() => addHistory(<span className="text-red-600">1...</span>), 3000);
                    setTimeout(() => {
                        setIsOpen(false);
                        setHistory([]);
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('system_failure', 'true');
                            window.location.reload();
                        }
                    }, 4000);
                    setInput('');
                    return;
                }

                if (cmdLower.startsWith('signup ')) {
                    const parts = cmd.split(' ');
                    if (parts.length < 3) {
                        response = <span className="text-red-400">Usage: signup &lt;email&gt; &lt;password&gt;</span>;
                    } else {
                        addHistory("Creating credentials...");
                        const { error } = await supabase.auth.signUp({
                            email: parts[1],
                            password: parts[2]
                        });
                        response = error ? <span className="text-red-500">Error: {error.message}</span> : <span className="text-green-500">Identity Created. Please verify email if required.</span>;
                    }
                    addHistory(response);
                    setInput('');
                    return;
                }

                if (cmdLower.startsWith('chat ')) {
                    if (!user) {
                        response = <span className="text-red-400">Access Denied. Please login first.</span>;
                    } else {
                        const content = cmd.substring(5);
                        const { error } = await supabase.from('messages').insert({
                            content,
                            user_id: user.id,
                            email: user.email
                        });
                        if (error) {
                            response = <span className="text-red-400">Transmission Failed: {error.message}</span>;
                        }
                    }
                    if (response) addHistory(response);
                    setInput('');
                    return;
                }

                if (cmdLower.startsWith('msg ') || cmdLower.startsWith('message ')) {
                    const parts = cmdLower.split(' ');
                    if (parts.length < 3) {
                        response = <span className="text-red-400">Usage: msg &lt;user&gt; &lt;message&gt;</span>;
                    } else {
                        if (!user) {
                            response = <span className="text-red-400">Login required for encrypted transmission.</span>;
                        } else {
                            const target = parts[1];
                            const content = cmd.split(' ').slice(2).join(' ');
                            const encodedMsg = `[PRIVATE to ${target}]: ${content}`; // Naive private msg approach

                            const { error } = await supabase.from('messages').insert({
                                content: encodedMsg,
                                user_id: user.id,
                                email: user.email
                            });

                            if (error) {
                                response = <span className="text-red-400">Encryption Failed: {error.message}</span>;
                            } else {
                                response = (
                                    <span className="text-blue-400">
                                        &#62;&#62; Encrypting packet... <br />
                                        &#62;&#62; Transmission sent to <span className="text-yellow-400">{target}</span>. <br />
                                        &#62;&#62; Status: <span className="text-green-500">DELIVERED</span>
                                    </span>
                                );
                            }
                        }
                    }
                    if (response) addHistory(response);
                    setInput('');
                    return;
                }

                response = <span className="text-red-400">Command not found: {cmd}</span>;
        }

        addHistory(response);
        setInput('');
    };

    return (
        <AnimatePresence mode="sync">
            {isOpen && (
                <motion.div
                    key="terminal-window"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed top-0 left-0 w-full h-[50vh] bg-black/95 border-b-2 border-${theme} z-[100] shadow-2xl overflow-hidden backdrop-blur-md font-mono text-sm md:text-base`}
                >
                    {/* Header */}
                    <div className={`bg-${theme.replace('500', '900')}/20 border-b border-${theme}/30 p-2 flex justify-between items-center px-4`}>
                        <div className={`flex items-center gap-2 text-${theme}`}>
                            <TerminalIcon className="w-4 h-4" />
                            <span>BASH // IOT_ROOT</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className={`text-${theme} hover:text-white`}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Terminal Body */}
                    {isPlayingGame ? (
                        <TerminalGame onExit={() => setIsPlayingGame(false)} />
                    ) : (
                        <div className={`p-4 h-[calc(100%-3rem)] overflow-y-auto custom-scrollbar text-${theme.replace('500', '400')}`} onClick={() => inputRef.current?.focus()}>
                            <div className="space-y-2">
                                {history.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex gap-2 opacity-80">
                                            <span className="text-purple-400">{item.user}@iot-club:~$</span>
                                            <span>{item.cmd}</span>
                                        </div>
                                        <div className="pl-4 mb-2 text-gray-300">{item.output}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Line */}
                            <form onSubmit={handleCommand} className="flex gap-2 mt-2 items-center">
                                <span className="text-purple-400">{username}@iot-club:~$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className={`bg-transparent border-none outline-none flex-1 text-${theme.replace('500', '400')} placeholder-${theme.replace('500', '800')}`}
                                    autoFocus
                                />
                                <div className={`w-2 h-4 bg-${theme} animate-pulse`} />
                            </form>
                            <div ref={endRef} />
                        </div>
                    )}
                </motion.div>
            )}
            <BirthdaySurprise
                key="birthday-surprise"
                isOpen={showSurprise}
                onClose={() => setShowSurprise(false)}
            />
            {isHacking && <MatrixRain key="matrix-rain" />}
        </AnimatePresence>
    );
}

