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
import SnakeGame from './SnakeGame';
import SpaceInvaders from './SpaceInvaders';



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
    const [isPlayingSnake, setIsPlayingSnake] = useState(false);
    const [isPlayingInvaders, setIsPlayingInvaders] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('guest');
    const [memberPopup, setMemberPopup] = useState<{ name: string; role: string; team: string; image: string; funFact: string; nickname: string } | null>(null);

    // Fun personality profiles for key members
    const MEMBER_PERSONALITIES: Record<string, { funFact: string; emoji: string; nickname: string }> = {
        "rudrakshi": {
            funFact: "The Backbone of the Club 👑 — Our President and the glue that holds everything together. She handles permissions, PR, logistics, and basically runs the show. When things need to get done, Rudrakshi has already done them. The club literally doesn't function without her leadership!",
            emoji: "👑",
            nickname: "The Boss"
        },
        "pushp": {
            funFact: "The All-Rounder 🦾 — Codes like a wizard, builds robots like an engineer, AND somehow manages to get all the permissions done. If there's work to be done, Pushp has probably already finished it, had his chai, and started on the next project. Tech Lead energy!",
            emoji: "🦾",
            nickname: "Techno-Gandhi"
        },
        "tanya": {
            funFact: "The Silent Engine 🔧 — Behind every successful event is Tanya making sure the backend doesn't crash (both literally and metaphorically). She manages logistics, coordination, and keeps the chaos organized. Events literally don't happen without her!",
            emoji: "🔧",
            nickname: "Event Whisperer"
        },
        "harshit": {
            funFact: "The Multitasker 🎭 — In more clubs than you can count, misses meetings like a pro, but somehow still delivers when it matters! Our guy is everywhere and nowhere at the same time. Legend says he attends meetings via astral projection.",
            emoji: "🎭",
            nickname: "Phantom Member"
        },
        "vedant": {
            funFact: "The Creator 🚀 — Yeah, that's me! I built this website you're looking at right now. When I'm not coding at 3 AM or debugging my life choices, you'll find me flying drones or adding easter eggs to this site. If you found this, congrats — you're one of the cool ones! 😎",
            emoji: "🚀",
            nickname: "The Architect"
        }
    };


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

        // Add output without showing command prompt (for async outputs)
        const addOutput = (output: React.ReactNode) => {
            setHistory(prev => [...prev, { cmd: '', output, user: '' }]);
        };

        switch (cmdLower) {
            case 'help':
                response = (
                    <div className="space-y-1 font-mono text-sm">
                        <p className="text-cyan-400 font-bold tracking-wider">[ SYSTEM ]</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">help</span>     <span className="text-gray-500">→</span> Display command list</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">about</span>    <span className="text-gray-500">→</span> Club information</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">clear</span>    <span className="text-gray-500">→</span> Clear terminal buffer</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">ls</span>       <span className="text-gray-500">→</span> List directory contents</p>

                        <p className="text-cyan-400 font-bold mt-3 tracking-wider">[ AUTH ]</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">login</span>    <span className="text-gray-500">→</span> Authenticate session</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">signup</span>   <span className="text-gray-500">→</span> Create new account</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">logout</span>   <span className="text-gray-500">→</span> Terminate session</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">whoami</span>   <span className="text-gray-500">→</span> Current user status</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">whois</span>    <span className="text-gray-500">→</span> Query member database</p>

                        <p className="text-cyan-400 font-bold mt-3 tracking-wider">[ NETWORK ]</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">chat</span>     <span className="text-gray-500">→</span> Broadcast to channel</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">msg</span>      <span className="text-gray-500">→</span> Send encrypted message</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">nick</span>     <span className="text-gray-500">→</span> Change codename</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">ping</span>     <span className="text-gray-500">→</span> Test connection</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">ip</span>       <span className="text-gray-500">→</span> Trace route</p>

                        <p className="text-purple-400 font-bold mt-3 tracking-wider">[ UTILS ]</p>
                        <p className="pl-4 text-gray-300">  <span className="text-green-400">coffee</span>   <span className="text-gray-500">→</span> Loading productivity...</p>
                        <p className="pl-4 text-gray-300">  <span className="text-green-400">type</span>     <span className="text-gray-500">→</span> Typewriter output</p>
                        <p className="pl-4 text-gray-300">  <span className="text-green-400">rickroll</span> <span className="text-gray-500">→</span> [CLASSIFIED]</p>

                        <p className="text-yellow-400 font-bold mt-3 tracking-wider">[ GAMES ]</p>
                        <p className="pl-4 text-gray-300">  <span className="text-green-400">snake</span>    <span className="text-gray-500">→</span> Classic arcade</p>
                        <p className="pl-4 text-gray-300">  <span className="text-green-400">invaders</span> <span className="text-gray-500">→</span> Space defense</p>
                        <p className="pl-4 text-gray-300">  <span className="text-green-400">game</span>     <span className="text-gray-500">→</span> Firewall protocol</p>

                        <p className="text-red-400 font-bold mt-3 tracking-wider">[ ADMIN ]</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">hack</span>     <span className="text-gray-500">→</span> Matrix protocol</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">twin</span>     <span className="text-gray-500">→</span> 3D Model Viewer</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">theme</span>    <span className="text-gray-500">→</span> Change UI theme</p>
                        <p className="pl-4 text-gray-300">  <span className="text-yellow-400">cat</span>      <span className="text-gray-500">→</span> Read file contents</p>
                        <p className="pl-4 text-gray-300">  <span className="text-red-500 animate-pulse">sudo</span>     <span className="text-gray-500">→</span> <span className="text-red-400">RESTRICTED</span></p>
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

            // ☕ COFFEE
            case 'coffee':
                response = (
                    <div className="font-mono text-yellow-600">
                        <pre>{`
        ( (
         ) )
      .______.
      |      |]
      \\      /
       \`----'
                        `}</pre>
                        <p className="text-green-400 animate-pulse mt-2">☕ Loading productivity... Please wait...</p>
                        <p className="text-gray-400 text-xs mt-1">Estimated time: ∞</p>
                    </div>
                );
                break;

            // 💀 SKULL
            case 'skull':
                response = (
                    <div className="font-mono text-red-500">
                        <pre>{`
      ___________
     /           \\
    |  RIP BUGS  |
    |   2024     |
    |___________|
        |   |
       _|   |_
      |       |
                        `}</pre>
                        <p className="text-gray-400 text-sm mt-2">Here lies all the bugs we've squashed... 💀</p>
                    </div>
                );
                break;

            // 🎵 RICKROLL
            case 'rickroll':
            case 'rick':
                addHistory(<span className="text-cyan-400">Initiating secure audio stream...</span>);
                setTimeout(() => {
                    addOutput(
                        <div className="text-purple-400 font-bold animate-pulse">
                            <p>🎵 Never gonna give you up!</p>
                            <p>🎵 Never gonna let you down!</p>
                            <p>🎵 Never gonna run around and desert you!</p>
                            <p className="text-yellow-400 mt-2">You just got RICKROLLED! 🕺</p>
                        </div>
                    );
                    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                }, 1500);
                setInput('');
                return;

            // 🐍 SNAKE (placeholder - would need a full game component)
            case 'snake':
                response = (
                    <div className="text-green-400">
                        <pre>{`
    🐍 ████████░░░░░░░░░░
       ←←←←←←←
                        `}</pre>
                        <p className="text-yellow-400 mt-2">🎮 Launching Snake...</p>
                    </div>
                );
                setTimeout(() => setIsPlayingSnake(true), 500);
                break;

            // 👾 INVADERS
            case 'invaders':
            case 'spaceinvaders':
            case 'space':
                response = (
                    <div className="text-purple-400 font-mono">
                        <pre>{`
   👾 👾 👾 👾 👾
     👾 👾 👾 👾
       👾 👾 👾
    
        🚀
    ═══════════
                        `}</pre>
                        <p className="text-yellow-400 mt-2">🎮 Launching Space Invaders...</p>
                    </div>
                );
                setTimeout(() => setIsPlayingInvaders(true), 500);
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
                        // Check if any result has a personality profile (key member)
                        const keyMember = results.find(m =>
                            MEMBER_PERSONALITIES[m.id.toLowerCase()] ||
                            MEMBER_PERSONALITIES[m.name.toLowerCase().split(' ')[0].toLowerCase()]
                        );

                        if (keyMember) {
                            const personality = MEMBER_PERSONALITIES[keyMember.id.toLowerCase()] ||
                                MEMBER_PERSONALITIES[keyMember.name.toLowerCase().split(' ')[0].toLowerCase()];

                            // Trigger popup for key member
                            setMemberPopup({
                                name: keyMember.name,
                                role: keyMember.role,
                                team: keyMember.team,
                                image: keyMember.image,
                                funFact: personality?.funFact || keyMember.bio,
                                nickname: personality?.nickname || ""
                            });

                            response = (
                                <div className="space-y-2">
                                    <p className="text-yellow-400 font-bold">{personality?.emoji} {keyMember.name} {personality?.nickname ? `aka "${personality.nickname}"` : ''}</p>
                                    <p><span className="text-cyan-400">Role:</span> {keyMember.role}</p>
                                    <p><span className="text-cyan-400">Team:</span> {keyMember.team}</p>
                                    <p className="text-green-400 italic mt-2">{personality?.funFact}</p>
                                    <p className="text-gray-500 text-sm mt-2">[Opening profile card...]</p>
                                </div>
                            );
                        } else {
                            // Regular member display
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
                        }
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
                        response = <span className="text-red-400">Usage: login &lt;username&gt; &lt;password&gt;</span>;
                    } else {
                        addHistory("Authenticating with Staff Mainframe...");
                        try {
                            const res = await fetch('/api/staff/login', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username: parts[1], password: parts[2] }),
                            });

                            const data = await res.json();

                            if (res.ok) {
                                response = <span className="text-green-500">Access Granted. Welcome, {data.user.username}. Redirecting...</span>;
                                setTimeout(() => router.push('/staff/dashboard'), 1000);
                            } else {
                                response = <span className="text-red-500">Error: {data.error}</span>;
                            }
                        } catch (err) {
                            response = <span className="text-red-500">Connection Failed.</span>;
                        }
                    }
                    addHistory(response);
                    setInput('');
                    return;
                }

                if (cmdLower === 'dashboard') {
                    addHistory("Opening Command Center...");
                    setTimeout(() => router.push('/staff/dashboard'), 500);
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

                // 📡 PING - Ping a member
                if (cmdLower.startsWith('ping ')) {
                    const target = cmd.split(' ').slice(1).join(' ');
                    addHistory(<span className="text-cyan-400">📡 Initiating connection to {target}...</span>);
                    setTimeout(() => addOutput(<span className="text-gray-400">PING {target}.iot-club.local ({Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)})</span>), 300);
                    setTimeout(() => addOutput(<span className="text-green-400">64 bytes from {target}: icmp_seq=1 ttl=64 time={Math.floor(Math.random() * 50)}ms</span>), 600);
                    setTimeout(() => addOutput(<span className="text-green-400">64 bytes from {target}: icmp_seq=2 ttl=64 time={Math.floor(Math.random() * 50)}ms</span>), 900);
                    setTimeout(() => addOutput(<span className="text-green-400">64 bytes from {target}: icmp_seq=3 ttl=64 time={Math.floor(Math.random() * 50)}ms</span>), 1200);
                    setTimeout(() => addOutput(
                        <div className="text-yellow-400 mt-2">
                            <p>--- {target} ping statistics ---</p>
                            <p className="text-green-500">3 packets transmitted, 3 received, 0% packet loss</p>
                            <p className="text-gray-400">✅ {target} is ONLINE and responsive!</p>
                        </div>
                    ), 1500);
                    setInput('');
                    return;
                }

                // 🌐 IP TRACE - Fake IP tracing animation
                if (cmdLower === 'ip' || cmdLower === 'trace' || cmdLower === 'traceroute') {
                    addHistory(<span className="text-red-500 font-bold animate-pulse">⚠️ WARNING: TRACING ACTIVE CONNECTION...</span>);
                    const fakeIPs = [
                        '192.168.1.1 (Local Gateway)',
                        '10.0.0.1 (ISP Node)',
                        '72.14.213.99 (Google Edge)',
                        '142.250.185.46 (Mumbai Datacenter)',
                        '34.93.125.22 (Bennett University)',
                        '10.20.30.40 (IoT Lab Server)'
                    ];
                    fakeIPs.forEach((ip, i) => {
                        setTimeout(() => addOutput(
                            <span className="text-cyan-400">
                                Hop {i + 1}: <span className="text-green-400">{ip}</span> [{Math.floor(Math.random() * 100)}ms]
                            </span>
                        ), 400 * (i + 1));
                    });
                    setTimeout(() => addOutput(
                        <div className="text-green-500 font-bold mt-2 border border-green-500 p-2">
                            <p>🎯 TRACE COMPLETE</p>
                            <p className="text-yellow-400">Target Located: Bennett University IoT Lab</p>
                            <p className="text-gray-400 text-xs">GPS: 28.4595° N, 77.5021° E</p>
                        </div>
                    ), 3000);
                    setInput('');
                    return;
                }

                // ⌨️ TYPE - Typewriter effect
                if (cmdLower.startsWith('type ')) {
                    const text = cmd.substring(5);
                    let output = '';
                    const chars = text.split('');
                    addHistory(<span className="text-gray-500">⌨️ Typing...</span>);
                    chars.forEach((char, i) => {
                        setTimeout(() => {
                            output += char;
                            if (i === chars.length - 1) {
                                addOutput(<span className="text-green-400 font-mono">{output}</span>);
                            }
                        }, 50 * i);
                    });
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

            {/* Snake Game */}
            {isPlayingSnake && (
                <SnakeGame
                    key="snake-game"
                    onClose={() => setIsPlayingSnake(false)}
                />
            )}

            {/* Space Invaders */}
            {isPlayingInvaders && (
                <SpaceInvaders
                    key="space-invaders"
                    onClose={() => setIsPlayingInvaders(false)}
                />
            )}

            {/* Member Profile Popup */}
            {memberPopup && (
                <motion.div
                    key="member-popup"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
                    onClick={() => setMemberPopup(null)}
                >
                    <motion.div
                        initial={{ scale: 0.5, rotateY: 90 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        exit={{ scale: 0.5, rotateY: -90 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-green-500 rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_100px_rgba(34,197,94,0.4),inset_0_0_30px_rgba(34,197,94,0.1)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Animated Corner Brackets */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-400 rounded-tl-xl animate-pulse" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-400 rounded-tr-xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-xl animate-pulse" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-400 rounded-br-xl animate-pulse" />

                        {/* Close Button */}
                        <button
                            onClick={() => setMemberPopup(null)}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-400 transition-colors z-10"
                        >
                            <span className="font-mono text-sm hover:animate-pulse">[X] CLOSE</span>
                        </button>

                        {/* CLASSIFIED Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 px-4 py-1 rounded-full text-xs font-bold font-mono tracking-widest animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                            ⚠️ CLASSIFIED PERSONNEL FILE ⚠️
                        </div>

                        {/* Profile Photo with Glitch Effect */}
                        <div className="flex justify-center mb-6 mt-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
                                <div className="relative w-36 h-36 rounded-full border-4 border-green-400 overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                                    <img
                                        src={memberPopup.image}
                                        alt={memberPopup.name}
                                        className="w-full h-full object-cover object-top scale-125 group-hover:scale-150 transition-transform duration-300"
                                    />
                                    {/* Scan line effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-transparent opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-1000" />
                                </div>
                                {/* Status indicator */}
                                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-ping" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                            </div>
                        </div>

                        {/* Name & Nickname with Glitch */}
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-green-400 font-orbitron tracking-wider">
                                {memberPopup.name}
                            </h2>
                            {memberPopup.nickname && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-yellow-400 text-lg font-mono mt-1"
                                >
                                    &lt;{memberPopup.nickname}&gt;
                                </motion.p>
                            )}
                        </div>

                        {/* Role & Team - Terminal Style */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-black/80 rounded-lg p-4 mb-4 border border-green-500/40 font-mono text-sm"
                        >
                            <div className="flex gap-2 mb-2">
                                <span className="text-green-500">$</span>
                                <span className="text-gray-400">cat /personnel/{memberPopup.name.split(' ')[0].toLowerCase()}.info</span>
                            </div>
                            <div className="pl-4 space-y-1">
                                <p><span className="text-cyan-400">ROLE:</span> <span className="text-white">{memberPopup.role}</span></p>
                                <p><span className="text-cyan-400">TEAM:</span> <span className="text-purple-400">{memberPopup.team}</span></p>
                                <p><span className="text-cyan-400">STATUS:</span> <span className="text-green-400 animate-pulse">ACTIVE</span></p>
                            </div>
                        </motion.div>

                        {/* Fun Fact - Highlighted */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-r from-green-500/20 via-green-500/10 to-green-500/20 rounded-lg p-5 border border-green-400/50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 text-green-500/30 font-mono text-xs">/* INTEL */</div>
                            <p className="text-gray-200 text-sm leading-relaxed pt-4">{memberPopup.funFact}</p>
                        </motion.div>

                        {/* HEX Code Footer */}
                        <div className="mt-4 text-center text-green-500/40 font-mono text-[10px] tracking-widest">
                            ID: {Math.random().toString(16).substr(2, 8).toUpperCase()} | CLEARANCE: LEVEL 5
                        </div>

                        {/* Scanlines Overlay */}
                        <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.02)_50%)] bg-[length:100%_4px]" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

