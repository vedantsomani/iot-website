"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Minus, User, ChevronRight } from "lucide-react";

// Import actual website data
import eventsData from "@/data/events.json";
import projectsData from "@/data/projects.json";
import membersData from "@/data/members.json";
import achievementsData from "@/data/achievements.json";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
    type?: "text" | "options";
    options?: string[];
    image?: string;
};

// Helper functions to process data
const getUpcomingEvents = () => {
    const upcoming = eventsData.filter((e: any) => e.type === "upcoming");
    if (upcoming.length === 0) return "No upcoming events at the moment. Check back soon!";
    return upcoming.map((e: any) => `• ${e.title} - ${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${e.location}`).join('\n');
};

const getFeaturedProjects = () => {
    const featured = projectsData.filter((p: any) => p.featured).slice(0, 5);
    return featured.map((p: any) => `• ${p.title}: ${p.shortDesc}`).join('\n');
};

const getProjectByName = (name: string) => {
    const lower = name.toLowerCase();
    const project = projectsData.find((p: any) =>
        p.title.toLowerCase().includes(lower) || p.slug.includes(lower)
    );
    if (project) {
        return `📦 ${(project as any).title}\n${(project as any).description}\n\nTech Stack: ${(project as any).techStack.join(', ')}\nTeam: ${(project as any).team.join(', ')}`;
    }
    return null;
};

const getTeamByDepartment = (dept: string) => {
    const lower = dept.toLowerCase();
    const members = membersData.filter((m: any) => m.team.toLowerCase().includes(lower));
    if (members.length === 0) return null;
    return members.map((m: any) => `• ${m.name} - ${m.role}`).join('\n');
};

const getExecutiveTeam = () => {
    const execs = membersData.filter((m: any) => m.team === "Executive");
    return execs.map((m: any) => `• ${m.name} - ${m.role}`).join('\n');
};

const getAllTeams = () => {
    const teams = [...new Set(membersData.map((m: any) => m.team))];
    return teams.join(', ');
};

const getAchievements = () => {
    return achievementsData.slice(0, 4).map((a: any) => `🏆 ${a.title} (${a.result})`).join('\n');
};

const getTotalStats = () => {
    return `📊 Club Stats:\n• Total Members: ${membersData.length}+\n• Projects Built: ${projectsData.length}+\n• Events Hosted: ${eventsData.length}+\n• Achievements: ${achievementsData.length}+`;
};

// Simple member lookup by name
const getMemberByName = (name: string): string | null => {
    const lower = name.toLowerCase().trim();
    const member = membersData.find((m: any) =>
        m.name.toLowerCase().includes(lower) ||
        m.id.toLowerCase().includes(lower)
    );

    if (member) {
        const m = member as any;
        let info = `👤 ${m.name}\n\n🏷️ Role: ${m.role}\n🏢 Team: ${m.team}`;
        if (m.bio && m.bio !== "Contributing to technical projects." && m.bio.length > 10) {
            info += `\n📝 Bio: ${m.bio}`;
        }
        return info;
    }
    return null;
};

// Main response generator
const generateResponse = (input: string): { text: string; options?: string[] } => {
    const lower = input.toLowerCase();

    // Greetings
    if (/^(hi|hello|hey|sup|yo|start)/.test(lower)) {
        return {
            text: "Greetings, human! I am IOT-X, your virtual assistant for the IoT & Robotics Club. I have access to all club data. What would you like to know?",
            options: ["Upcoming Events", "Our Projects", "Meet the Team", "Club Stats"]
        };
    }

    // Identity
    if (lower.includes("who are you") || lower.includes("what are you")) {
        return {
            text: "I am IOT-X — an AI construct integrated into the Bennett University IoT & Robotics Club network. I can tell you about our events, projects, team members, and achievements.",
            options: ["View Projects", "View Events"]
        };
    }

    // Events
    if (lower.includes("event") || lower.includes("workshop") || lower.includes("hackathon") || lower.includes("upcoming")) {
        const events = getUpcomingEvents();
        return {
            text: `📅 Upcoming Events:\n${events}`,
            options: ["Tell me about Rewire", "Past Events"]
        };
    }

    // Rewire specifically
    if (lower.includes("rewire")) {
        const rewire = eventsData.find((e: any) => e.id === "rewire-2026");
        if (rewire) {
            return {
                text: `🔥 REWIRE 2026\n${(rewire as any).description}\n\n📍 Location: ${(rewire as any).location}\n🕐 Time: ${(rewire as any).time}\n📅 Date: Feb 3-4, 2026\n\nThis is our flagship event with an Ideathon on Day 1 and an Escape Room challenge on Day 2!`,
                options: ["Register for Rewire"]
            };
        }
    }

    // Projects
    if (lower.includes("project") || lower.includes("build") || lower.includes("make")) {
        // Check for specific project
        const specificProject = getProjectByName(lower.replace(/project|about|tell|me|the/gi, '').trim());
        if (specificProject) {
            return { text: specificProject, options: ["More Projects"] };
        }

        const projects = getFeaturedProjects();
        return {
            text: `🚀 Featured Projects:\n${projects}\n\nWe work on drones, robots, AI assistants, and more!`,
            options: ["Drone Projects", "AI Projects", "View All Projects"]
        };
    }

    // Drones
    if (lower.includes("drone") || lower.includes("uav") || lower.includes("aerial")) {
        const drones = projectsData.filter((p: any) =>
            p.techStack.some((t: string) => t.toLowerCase().includes("drone")) ||
            p.title.toLowerCase().includes("drone") ||
            p.title.toLowerCase().includes("hexacopter")
        );
        const list = drones.map((d: any) => `• ${d.title}: ${d.shortDesc}`).join('\n');
        return { text: `🛸 Drone Projects:\n${list}`, options: ["Other Projects"] };
    }

    // AI
    if (lower.includes("ai") || lower.includes("artificial") || lower.includes("machine learning")) {
        const aiProjects = projectsData.filter((p: any) =>
            p.techStack.some((t: string) => t.toLowerCase().includes("ai") || t.toLowerCase().includes("ml"))
        );
        const list = aiProjects.map((a: any) => `• ${a.title}: ${a.shortDesc}`).join('\n');
        return { text: `🤖 AI/ML Projects:\n${list}`, options: ["Other Projects"] };
    }

    // Team / Members
    if (lower.includes("team") || lower.includes("member") || lower.includes("who")) {
        // Check for specific team
        if (lower.includes("tech")) {
            const tech = getTeamByDepartment("tech");
            return { text: `💻 Tech Team:\n${tech}`, options: ["Other Teams"] };
        }
        if (lower.includes("design")) {
            const design = getTeamByDepartment("design");
            return { text: `🎨 Design Team:\n${design}`, options: ["Other Teams"] };
        }
        if (lower.includes("management")) {
            const mgmt = getTeamByDepartment("management");
            return { text: `📋 Management Team:\n${mgmt}`, options: ["Other Teams"] };
        }
        if (lower.includes("executive") || lower.includes("president") || lower.includes("leader")) {
            const execs = getExecutiveTeam();
            return { text: `👔 Executive Team:\n${execs}`, options: ["View All Teams"] };
        }

        return {
            text: `👥 Our Teams: ${getAllTeams()}\n\nWe have ${membersData.length}+ active members across various departments!`,
            options: ["Executive Team", "Tech Team", "Design Team"]
        };
    }

    // Achievements
    if (lower.includes("achievement") || lower.includes("award") || lower.includes("won") || lower.includes("prize")) {
        const achievements = getAchievements();
        return {
            text: `🏆 Recent Achievements:\n${achievements}`,
            options: ["View All"]
        };
    }

    // Stats
    if (lower.includes("stat") || lower.includes("number") || lower.includes("how many")) {
        return { text: getTotalStats(), options: ["Projects", "Events", "Team"] };
    }

    // Join
    if (lower.includes("join") || lower.includes("recruit") || lower.includes("apply") || lower.includes("member")) {
        return {
            text: "🎯 Want to join our ranks?\n\nWe recruit passionate students from all branches. No prior experience needed — just curiosity and dedication!\n\nHead to our Join page to apply.",
            options: ["Go to Join Page"]
        };
    }

    // Contact
    if (lower.includes("contact") || lower.includes("reach") || lower.includes("email") || lower.includes("location")) {
        return {
            text: "📬 Contact Us:\n\n📍 Location: Bennett University, Lab 105 (Sector B)\n📧 Check our Contact page for more\n📱 Follow us on Instagram: @iot_robotics_bu",
            options: ["Go to Contact"]
        };
    }

    // Tech stack
    if (lower.includes("tech") && (lower.includes("stack") || lower.includes("use") || lower.includes("language"))) {
        return {
            text: "🔧 Technologies We Use:\n\n• Languages: Python, C/C++, JavaScript, TypeScript\n• Hardware: Arduino, Raspberry Pi, ESP32, STM32\n• Frameworks: React, Next.js, ROS\n• AI/ML: TensorFlow, OpenCV, PyTorch\n• 3D: Fusion 360, SolidWorks",
            options: ["View Projects"]
        };
    }

    // Help
    if (lower.includes("help") || lower.includes("what can you")) {
        return {
            text: "🤖 I can help you with:\n\n• Info about upcoming Events\n• Details on our Projects\n• Meet the Team members (type a name!)\n• Club Achievements\n• How to Join\n• Contact information\n\nJust ask!",
            options: ["Events", "Projects", "Team", "Join"]
        };
    }

    // Try to find a member by name (before fallback)
    const memberInfo = getMemberByName(lower);
    if (memberInfo) {
        return {
            text: memberInfo,
            options: ["View Full Team", "Other Teams"]
        };
    }

    // Fallback
    return {
        text: "I couldn't find specific info about that in my database. Try asking about our events, projects, team (or type a member's name!), achievements, or how to join!",
        options: ["Upcoming Events", "Our Projects", "Meet the Team", "How to Join"]
    };
};

export default function AiChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "System Online. Establishing secure link...",
            sender: "bot",
            timestamp: new Date()
        },
        {
            id: "2",
            text: `Welcome! I am IOT-X, your club assistant. I have access to ${projectsData.length} projects, ${eventsData.length} events, and ${membersData.length} team members. How can I help?`,
            sender: "bot",
            timestamp: new Date(),
            type: "options",
            options: ["Upcoming Events", "Featured Projects", "Meet the Team"]
        }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate processing delay
        setTimeout(() => {
            const response = generateResponse(text);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                sender: "bot",
                timestamp: new Date(),
                type: response.options ? "options" : "text",
                options: response.options
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 600);
    };

    const handleOptionClick = (option: string) => {
        const lower = option.toLowerCase();

        // Navigation options
        if (lower.includes("go to") || lower === "register for rewire") {
            if (lower.includes("join")) window.location.href = "/join";
            else if (lower.includes("project") || lower.includes("all projects")) window.location.href = "/projects";
            else if (lower.includes("event") || lower.includes("past events")) window.location.href = "/events";
            else if (lower.includes("contact")) window.location.href = "/contact";
            else if (lower.includes("rewire")) window.location.href = "/events/rewire";
            else if (lower.includes("view all")) window.location.href = "/about";
            return;
        }

        handleSend(option);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-black/90 backdrop-blur-xl border border-neon-blue/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-neon-blue/20 to-transparent border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <div className="flex flex-col">
                                    <span className="text-neon-blue font-bold font-orbitron text-sm">IOT-X ASSISTANT</span>
                                    <span className="text-[10px] text-gray-400 font-mono">CONNECTED // DATA SYNCED</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-neon-blue/20 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${msg.sender === 'user' ? 'bg-purple-900/30 border-purple-500/30' : 'bg-neon-blue/10 border-neon-blue/30'
                                            }`}>
                                            {msg.sender === 'user' ? <User size={14} className="text-purple-400" /> : <Bot size={14} className="text-neon-blue" />}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className={`p-3 rounded-2xl text-sm whitespace-pre-line ${msg.sender === 'user'
                                                ? 'bg-purple-600 text-white rounded-tr-none'
                                                : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            {msg.options && (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {msg.options.map(opt => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => handleOptionClick(opt)}
                                                            className="text-xs px-3 py-1 bg-neon-blue/10 hover:bg-neon-blue/30 border border-neon-blue/30 text-neon-blue rounded-full transition-colors flex items-center gap-1"
                                                        >
                                                            {opt} <ChevronRight size={10} />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-8 h-8 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center">
                                            <Bot size={14} className="text-neon-blue" />
                                        </div>
                                        <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-neon-blue/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-neon-blue/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-neon-blue/50 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/60 border-t border-white/10">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 transition-colors placeholder:text-gray-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="p-2 bg-neon-blue/20 hover:bg-neon-blue/40 text-neon-blue rounded-xl border border-neon-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setIsOpen(true);
                    setIsMinimized(false);
                }}
                className={`w-14 h-14 rounded-full bg-black/80 backdrop-blur-md border border-neon-blue/50 shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center justify-center group overflow-hidden relative ${isOpen && !isMinimized ? 'hidden' : 'flex'}`}
            >
                <div className="absolute inset-0 bg-neon-blue/20 group-hover:bg-neon-blue/30 transition-colors" />
                <Bot size={28} className="text-neon-blue relative z-10 group-hover:rotate-12 transition-transform" />

                {!isOpen && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    </div>
                )}
            </motion.button>
        </div>
    );
}
