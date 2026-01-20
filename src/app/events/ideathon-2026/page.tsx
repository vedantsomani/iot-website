"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, User, Users, Shield, FileText, Lock, Unlock, AlertTriangle, Zap, Edit, Download, Crosshair, ArrowRight } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import ParticleBackground from "@/components/ParticleBackground";
import { CyberLock } from "@/components/CyberLock";
import { Section } from "@/components/ui/Section";
import { MissionTimer } from "@/components/MissionTimer";

export default function IdeathonPage() {
    const [protocolsRead, setProtocolsRead] = useState(false);
    const [step, setStep] = useState(1);

    // Force scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [activeMember, setActiveMember] = useState(0);
    const [formData, setFormData] = useState({
        teamName: '',
        members: [
            { name: '', email: '' },
            { name: '', email: '' },
            { name: '', email: '' },
            { name: '', email: '' }
        ],
        track: ''
    });

    const nextStep = () => setStep(s => s + 1);

    const handleMemberInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newMembers = [...formData.members];
        newMembers[index] = { ...newMembers[index], [e.target.name]: e.target.value };
        setFormData({ ...formData, members: newMembers });
    };

    const isStep1Valid = formData.members.every(m => m.name && m.email);

    return (
        <div className="min-h-screen bg-black relative">
            <ParticleBackground />

            <div className="absolute top-0 left-0 w-full p-6 z-30">
                <Button variant="ghost" asChild className="text-gray-400 hover:text-white">
                    <a href="/events">← Back to Main Network</a>
                </Button>
            </div>

            {/* HERO SECTION */}
            <section className="relative min-h-[80vh] flex items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-neon-blue/5 to-black z-10" />
                <Container className="relative z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="mb-6 flex items-center justify-center">
                            <CyberLock />
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold font-orbitron text-white mb-6 tracking-tighter">
                            IDEATHON <span className="text-neon-blue">2026</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 font-light">
                            OPERATION: ESCAPE ROOM. <br />
                            <span className="text-neon-purple font-mono text-base">&gt; 24 HOURS. 4 AGENTS. 1 MISSION.</span>
                        </p>

                        <MissionTimer targetDate="2026-02-04T09:00:00" />
                        <div className="mb-8" />

                        {!protocolsRead ? (
                            <Button
                                onClick={() => document.getElementById('protocols')?.scrollIntoView({ behavior: 'smooth' })}
                                size="lg"
                                className="bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md"
                            >
                                <FileText className="w-5 h-5 mr-2" /> Review Mission Protocols
                            </Button>
                        ) : (
                            <Button
                                onClick={() => document.getElementById('enlist')?.scrollIntoView({ behavior: 'smooth' })}
                                size="lg"
                                className="bg-neon-blue text-black hover:bg-white border-none animate-pulse"
                            >
                                <Shield className="w-5 h-5 mr-2" /> DEPLOY SQUAD
                            </Button>
                        )}
                    </motion.div>
                </Container>
            </section>

            {/* RULE BOOK SECTION */}
            <Section id="protocols" className="relative z-20 bg-black/80 border-t border-white/10 backdrop-blur-md">
                <Container className="max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="inline-block p-2 rounded bg-neon-purple/10 border border-neon-purple/30 mb-4">
                            <Lock className="w-6 h-6 text-neon-purple" />
                        </div>
                        <h2 className="text-4xl font-bold font-orbitron text-white mb-4">CLASSIFIED MISSION PROTOCOLS</h2>
                        <p className="text-gray-400">Accessing secure file: RULE_BOOK_V1.enc</p>
                    </div>

                    <div className="grid gap-6">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="glass-panel p-6 rounded-xl border-l-4 border-neon-blue"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-neon-blue" />
                                1. SQUAD COMPOSITION
                            </h3>
                            <p className="text-gray-300 ml-7">
                                Each squad must consist of exactly <strong>4 Agents</strong>. Cross-department alliances are permitted and encouraged. All agents must be physically present at Sector B (Lab 105) for the duration of the operation.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="glass-panel p-6 rounded-xl border-l-4 border-neon-purple"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-neon-purple" />
                                2. EQUIPMENT & TECH
                            </h3>
                            <p className="text-gray-300 ml-7">
                                Bring your own laptops and chargers. Basic hardware components (sensors, microcontrollers) will be provided by HQ, but squads may deploy their own approved gear. No signal jammers allowed.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="glass-panel p-6 rounded-xl border-l-4 border-green-500"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-500" />
                                3. CODE OF CONDUCT
                            </h3>
                            <p className="text-gray-300 ml-7">
                                Sabotage of rival squads will result in immediate court-martial (disqualification). Respect the integrity of the facility. Innovation is the primary directive.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="glass-panel p-6 rounded-xl border-l-4 border-red-500"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                4. MISSION TIMELINE (CRITICAL)
                            </h3>
                            <div className="text-gray-300 ml-7 space-y-2 text-sm">
                                <p><strong className="text-white">Day 1 [IDEATHON]:</strong> Topic Reveal (On-Site) &rarr; 2 Hours Intel/Research &rarr; Presentation Briefing.</p>
                                <p><strong className="text-neon-purple">Day 2 [ESCAPE ROOM]:</strong> Only the <span className="text-white font-bold">TOP 10 SQUADS</span> from Day 1 will advance to the Operation Escape Room phase.</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-12 text-center">
                        <Button
                            onClick={() => setProtocolsRead(true)}
                            size="lg"
                            disabled={protocolsRead}
                            className={`min-w-[200px] ${protocolsRead ? 'bg-green-600 hover:bg-green-600 cursor-default' : 'bg-neon-blue hover:bg-white hover:text-black'}`}
                        >
                            {protocolsRead ? (
                                <><Unlock className="w-5 h-5 mr-2" /> PROTOCOLS ACCEPTED</>
                            ) : (
                                "I ACKNOWLEDGE & ACCEPT"
                            )}
                        </Button>
                    </div>
                </Container>
            </Section>

            {/* TACTICAL RESOURCES */}
            <Section className="border-t border-white/5 bg-black/50 backdrop-blur-sm" spacing="small">
                <Container>
                    <div className="flex items-center gap-3 mb-8">
                        <Crosshair className="text-neon-purple w-6 h-6" />
                        <h2 className="text-2xl font-bold text-white tracking-widest">TACTICAL RESOURCES</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "MISSION BRIEF", size: "2.4 MB", icon: FileText },
                            { title: "CODE OF CONDUCT", size: "1.1 MB", icon: Shield },
                            { title: "FIELD ASSET PACK", size: "45 MB", icon: Download },
                        ].map((resource, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className="glass-panel p-6 rounded-lg border border-white/10 hover:border-neon-purple/50 transition-colors group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <resource.icon className="w-8 h-8 text-gray-500 group-hover:text-neon-purple transition-colors" />
                                    <span className="text-xs text-gray-500 font-mono">{resource.size}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-neon-purple opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>DOWNLOAD SECURE FILE</span>
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* REGISTRATION SECTION */}
            <Section id="enlist" className={`relative z-20 transition-opacity duration-1000 ${protocolsRead ? 'opacity-100' : 'opacity-30 grayscale pointer-events-none'}`}>
                <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Squad Visualizer */}
                    <div className="text-center lg:text-left">
                        {/* Squad Avatars */}
                        <div className="mb-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-neon-blue font-orbitron text-sm mb-4 tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4" /> SQUAD MANIFEST
                            </h3>
                            <div className="grid grid-cols-4 gap-4">
                                {formData.members.map((member, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div
                                            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${member.name
                                                ? 'bg-neon-blue/20 border-neon-blue text-neon-blue'
                                                : i === activeMember
                                                    ? 'bg-white/10 border-white text-white animate-pulse'
                                                    : 'bg-black/50 border-white/10 text-gray-600'
                                                }`}
                                        >
                                            <User className="w-8 h-8" />
                                        </div>
                                        <span className={`text-[10px] font-mono tracking-wider uppercase transition-colors ${member.name ? 'text-white' : 'text-gray-600'}`}>
                                            {member.name ? member.name.split(' ')[0] : `AGENT 0${i + 1}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4">
                            SQUAD <span className="text-neon-blue">ENLISTMENT</span>
                        </h2>
                        <p className="text-lg text-gray-300 max-w-md">
                            Assemble your 4-person elite squad. Registration requires a full roster.
                        </p>
                    </div>

                    {/* Right: Gamified Form */}
                    <div className="w-full max-w-md mx-auto">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="glass-panel p-8 rounded-2xl border-2 border-neon-blue/20"
                                >
                                    <h2 className="text-2xl font-bold font-orbitron text-white mb-6 flex items-center gap-3">
                                        <span className="bg-neon-blue/20 text-neon-blue px-3 py-1 rounded text-sm">01</span>
                                        SQUAD ROSTER
                                    </h2>

                                    {/* Member Tabs */}
                                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                        {formData.members.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveMember(i)}
                                                className={`px-3 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap ${activeMember === i
                                                    ? 'bg-neon-blue text-black font-bold'
                                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                    }`}
                                            >
                                                AGENT 0{i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-neon-blue/50 rounded-full" />
                                            <p className="text-xs text-neon-blue mb-4 font-mono pl-2">
                                                ENTERING DATA FOR: AGENT 0{activeMember + 1}
                                            </p>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Agent Name</label>
                                                    <input
                                                        name="name"
                                                        value={formData.members[activeMember].name}
                                                        onChange={(e) => handleMemberInput(activeMember, e)}
                                                        type="text"
                                                        autoFocus
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all outline-none"
                                                        placeholder="Codename or Real Name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Secure Comms (Email)</label>
                                                    <input
                                                        name="email"
                                                        value={formData.members[activeMember].email}
                                                        onChange={(e) => handleMemberInput(activeMember, e)}
                                                        type="email"
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all outline-none"
                                                        placeholder="agent@bennett.edu.in"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            {activeMember > 0 && (
                                                <Button variant="outline" onClick={() => setActiveMember(m => m - 1)}>Prev Agent</Button>
                                            )}
                                            {activeMember < 3 ? (
                                                <Button className="flex-1" onClick={() => setActiveMember(m => m + 1)}>
                                                    Next Agent <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={nextStep}
                                                    className="flex-1 group"
                                                    disabled={!isStep1Valid}
                                                >
                                                    Proceed to Loadout <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            )}
                                        </div>

                                        {!isStep1Valid && activeMember === 3 && (
                                            <p className="text-red-400 text-xs text-center mt-2">
                                                * All 4 agents must be registered
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="glass-panel p-8 rounded-2xl border-2 border-neon-purple/20"
                                >
                                    <h2 className="text-2xl font-bold font-orbitron text-white mb-6 flex items-center gap-3">
                                        <span className="bg-neon-purple/20 text-neon-purple px-3 py-1 rounded text-sm">02</span>
                                        CHOOSE LOADOUT
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Squad Name</label>
                                            <input
                                                name="teamName"
                                                value={formData.teamName}
                                                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                                type="text"
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple focus:shadow-[0_0_15px_rgba(189,0,255,0.3)] transition-all outline-none"
                                                placeholder="e.g. CyberNauts"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Mission Track</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Robotics', 'IoT', 'Software', 'Open Invoice'].map((track) => (
                                                    <button
                                                        key={track}
                                                        onClick={() => setFormData({ ...formData, track })}
                                                        className={`p-3 rounded-lg border text-sm transition-all ${formData.track === track
                                                            ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_10px_rgba(189,0,255,0.2)]'
                                                            : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/30'
                                                            }`}
                                                    >
                                                        {track}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                                            <Button
                                                onClick={async () => {
                                                    // Validate Emails
                                                    const emailRegex = /^[a-zA-Z0-9._%+-]+@(bennett\.edu\.in|gmail\.com)$/i;
                                                    const invalidMember = formData.members.find(m => !emailRegex.test(m.email.trim()));

                                                    if (invalidMember) {
                                                        alert(`Agent ${invalidMember.name || 'Unknown'} has an invalid email credentials. Only @bennett.edu.in and @gmail.com domains are authorized.`);
                                                        return;
                                                    }

                                                    try {
                                                        const res = await fetch('/api/register', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify(formData),
                                                        });
                                                        if (res.ok) nextStep();
                                                        else throw new Error('Failed');
                                                    } catch (e) {
                                                        alert('Registration failed. Please try again.');
                                                    }
                                                }}
                                                className="flex-[2] bg-neon-purple text-white hover:bg-neon-purple/80 border-none"
                                                disabled={!formData.teamName || !formData.track}
                                            >
                                                Confirm Loadout
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="glass-panel p-10 rounded-2xl border-2 border-green-500/30 text-center"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold font-orbitron text-white mb-2">MISSION ACCEPTED</h2>
                                    <p className="text-gray-400 mb-6">
                                        Squad <strong>{formData.teamName}</strong> is fully registered.
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 mb-6 text-left">
                                        {formData.members.map((m, i) => (
                                            <div key={i} className="bg-white/5 p-2 rounded text-xs text-gray-300 border border-white/10 flex items-center gap-2">
                                                <Shield className="w-3 h-3 text-neon-blue" />
                                                {m.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-8 font-mono text-sm text-neon-blue">
                                        &gt; DEPLOYMENT DATE: FEB 04, 2026<br />
                                        &gt; LOCATION: SECTOR B, LA 105<br />
                                        &gt; STATUS: STANDBY
                                    </div>
                                    <Button
                                        onClick={() => setStep(1)}
                                        variant="outline"
                                        className="w-full mb-3 border-dashed border-white/20 hover:border-white text-gray-400 hover:text-white"
                                    >
                                        <Edit className="w-4 h-4 mr-2" /> Modify Squad Roster
                                    </Button>
                                    <Button asChild size="lg" className="w-full bg-green-600 text-white hover:bg-green-500 border-none">
                                        <a href="/">Return to HQ</a>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Container>
            </Section>
        </div>
    );
}
