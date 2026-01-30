"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, User, Users, Shield, FileText, Lock, Unlock, AlertTriangle, Zap, ArrowRight, Crosshair, Mail, Phone } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import ParticleBackground from "@/components/ParticleBackground";
import { CyberLock } from "@/components/CyberLock";
import { Section } from "@/components/ui/Section";
import { MissionTimer } from "@/components/MissionTimer";

type RegistrationStep = 'form' | 'success';

export default function RewirePage() {
    const [protocolsRead, setProtocolsRead] = useState(false);
    const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('form');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [participantId, setParticipantId] = useState<string | null>(null);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: [] as string[],
        consent: false,
        source: 'ONLINE' as 'ONLINE' | 'STALL'
    });

    // Skills options
    const skillsOptions = [
        "Programming (Python/C++)",
        "Web Development",
        "Machine Learning/AI",
        "Electronics/Hardware",
        "IoT/Embedded Systems",
        "Robotics",
        "3D Printing/CAD",
        "UI/UX Design",
        "Other"
    ];

    // Force scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Check for existing registration
    useEffect(() => {
        const savedId = localStorage.getItem('rewire_participant_id');
        if (savedId) {
            setParticipantId(savedId);
            setProtocolsRead(true);
            setRegistrationStep('success');
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSkillToggle = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    // Direct registration - no OTP
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setGeneralError('');

        // Basic validation
        if (!formData.name || formData.name.trim().length < 2) {
            setGeneralError('Please enter your name');
            setIsSubmitting(false);
            return;
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setGeneralError('Please enter a valid email address');
            setIsSubmitting(false);
            return;
        }
        if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, '').replace(/^\+91/, ''))) {
            setGeneralError('Please enter a valid 10-digit phone number');
            setIsSubmitting(false);
            return;
        }
        if (formData.skills.length === 0) {
            setGeneralError('Please select at least one skill');
            setIsSubmitting(false);
            return;
        }
        if (!formData.consent) {
            setGeneralError('Please accept the terms to continue');
            setIsSubmitting(false);
            return;
        }

        try {
            // Direct registration to Apps Script
            const response = await fetch('/api/rewire/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone: formData.phone.replace(/[\s-]/g, '').replace(/^\+91/, ''),
                    skills: formData.skills,
                    consent: formData.consent,
                    source: formData.source,
                    // Optional fields - empty since we removed them
                    college: '',
                    year: ''
                })
            });

            const result = await response.json();

            if (!result.ok) {
                setGeneralError(result.message || 'Registration failed. Please try again.');
                return;
            }

            // Success!
            const pid = result.data?.participant_id;
            if (pid) {
                setParticipantId(pid);
                localStorage.setItem('rewire_participant_id', pid);
                setRegistrationStep('success');
            }
        } catch {
            setGeneralError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            REWIRE <span className="text-neon-blue">2026</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 font-light">
                            OPERATION: ESCAPE ROOM. <br />
                            <span className="text-neon-purple font-mono text-base">&gt; 24 HOURS. 4 AGENTS. 1 MISSION.</span>
                        </p>

                        <MissionTimer targetDate="2026-02-03T18:30:00" />
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
                            registrationStep === 'success' ? (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-md animate-fade-in">
                                    <p className="text-green-400 font-bold font-orbitron flex items-center justify-center gap-2">
                                        <CheckCircle className="w-5 h-5" /> STATUS: REGISTERED
                                    </p>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => document.getElementById('enlist')?.scrollIntoView({ behavior: 'smooth' })}
                                    size="lg"
                                    className="bg-neon-blue text-black hover:bg-white border-none animate-pulse"
                                >
                                    <Shield className="w-5 h-5 mr-2" /> REGISTER AS AGENT
                                </Button>
                            )
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
                                Each squad must consist of exactly <strong>4 Agents</strong>. Cross-department alliances are permitted and encouraged. All agents must be physically present at P LH 101 for the duration of the operation.
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
                            <div className="space-y-4">
                                <div>
                                    <strong className="text-white block mb-1">Day 1 [IDEATHON - OPEN INNOVATION]:</strong>
                                    <ul className="list-disc ml-5 space-y-1 text-xs text-gray-400">
                                        <li>Event Starts 06:30 PM.</li>
                                        <li>We provide the Problem Statements (P.S). Teams of 4.</li>
                                        <li>Event Flow: Judge Intro &gt; Presentation Requirements.</li>
                                        <li>Teams prepare presentation (2-3 hours).</li>
                                        <li>Judging Round: Top 10 Teams Shortlisted for Day 2.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-neon-purple block mb-1">Day 2 [ESCAPE ROOM]:</strong>
                                    <ul className="list-disc ml-5 space-y-1 text-xs text-gray-400">
                                        <li>Top 10 Teams from Day 1 advance.</li>
                                        <li>2 Escape Rooms. 5 Teams per room (Turn by Turn).</li>
                                        <li>Use your Magnets to solve puzzles!</li>
                                        <li>Prize Pool for Top 3 Teams.</li>
                                    </ul>
                                </div>
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

            {/* SPONSORS SECTION */}
            <Section className="relative z-20 bg-black/60 border-t border-white/5 backdrop-blur-md" spacing="small">
                <Container className="max-w-2xl text-center">
                    <h2 className="text-lg font-bold font-orbitron text-gray-400 mb-8 tracking-widest">MISSION SPONSORS</h2>
                    <div className="flex justify-center items-center gap-8">
                        <div className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-colors group">
                            <img
                                src="/images/sponsors/memory-magnet.png"
                                alt="Memory Magnet"
                                className="h-40 w-auto object-contain mx-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity transform group-hover:scale-105 duration-300"
                            />
                            <p className="text-sm text-gray-400 font-mono group-hover:text-neon-blue transition-colors">The Memory Magnets</p>
                        </div>
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
                            { title: "MISSION BRIEF", size: "ENCRYPTED", icon: Lock, locked: true },
                            { title: "CODE OF CONDUCT", size: "RESTRICTED", icon: Lock, locked: true },
                            { title: "FIELD ASSET PACK", size: "LOCKED", icon: Lock, locked: true },
                        ].map((resource, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className={`glass-panel p-6 rounded-lg border transition-colors group cursor-pointer ${resource.locked
                                    ? 'border-red-500/20 hover:border-red-500/50'
                                    : 'border-white/10 hover:border-neon-purple/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <resource.icon className={`w-8 h-8 transition-colors ${resource.locked ? 'text-red-500/50 group-hover:text-red-500' : 'text-gray-500 group-hover:text-neon-purple'
                                        }`} />
                                    <span className={`text-xs font-mono ${resource.locked ? 'text-red-400' : 'text-gray-500'
                                        }`}>{resource.size}</span>
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${resource.locked ? 'text-gray-400' : 'text-white'
                                    }`}>{resource.title}</h3>
                                <div className={`flex items-center gap-2 text-xs transition-opacity ${resource.locked
                                    ? 'text-red-500 opacity-100'
                                    : 'text-neon-purple opacity-0 group-hover:opacity-100'
                                    }`}>
                                    <span>{resource.locked ? "ACCESS DENIED" : "DOWNLOAD SECURE FILE"}</span>
                                    {!resource.locked && <ArrowRight className="w-3 h-3" />}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* REGISTRATION SECTION */}
            <Section id="enlist" className={`relative z-20 transition-opacity duration-1000 ${protocolsRead ? 'opacity-100' : 'opacity-30 grayscale pointer-events-none'}`}>
                <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Info */}
                    <div className="text-center lg:text-left">
                        <div className="mb-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-neon-blue font-orbitron text-sm mb-4 tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4" /> AGENT REGISTRATION
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Register yourself first, then form or join a squad. Confirmation will be sent to your email.
                            </p>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4">
                            AGENT <span className="text-neon-blue">ENLISTMENT</span>
                        </h2>
                        <p className="text-lg text-gray-300 max-w-md">
                            Register individually first. After registration, you can create or join a squad.
                        </p>
                    </div>

                    {/* Right: Registration Form */}
                    <div className="w-full max-w-md mx-auto">
                        <AnimatePresence mode="wait">
                            {/* FORM STEP */}
                            {registrationStep === 'form' && (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="glass-panel p-8 rounded-2xl border-2 border-neon-blue/20"
                                >
                                    <h2 className="text-2xl font-bold font-orbitron text-white mb-6 flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-neon-blue" />
                                        AGENT DETAILS
                                    </h2>

                                    {generalError && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                            {generalError}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Agent Name</label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                type="text"
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all outline-none"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> Secure Comms (Email)
                                            </label>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                type="email"
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all outline-none"
                                                placeholder="agent@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Phone className="w-3 h-3" /> Contact Frequency
                                            </label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-3 py-3 bg-white/5 border border-white/10 border-r-0 rounded-l-lg text-gray-400 text-sm">
                                                    +91
                                                </span>
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    type="tel"
                                                    maxLength={10}
                                                    className="w-full bg-black/50 border border-white/10 rounded-r-lg p-3 text-white focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all outline-none"
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Skill Matrix</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {skillsOptions.map((skill) => (
                                                    <button
                                                        key={skill}
                                                        type="button"
                                                        onClick={() => handleSkillToggle(skill)}
                                                        className={`p-2 rounded-lg border text-xs transition-all text-left ${formData.skills.includes(skill)
                                                            ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                                                            : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/30'
                                                            }`}
                                                    >
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="consent"
                                                    checked={formData.consent}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 mt-0.5 rounded bg-black/50 border-white/20"
                                                />
                                                <span className="text-xs text-gray-400">
                                                    I acknowledge the mission protocols and consent to receive tactical updates from IoT & Robotics Club, Bennett.
                                                </span>
                                            </label>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-neon-blue text-black hover:bg-white border-none font-bold mt-4"
                                        >
                                            {isSubmitting ? (
                                                <>Registering...</>
                                            ) : (
                                                <>COMPLETE REGISTRATION <ChevronRight className="w-4 h-4 ml-1" /></>
                                            )}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {/* SUCCESS STEP */}
                            {registrationStep === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="glass-panel p-10 rounded-2xl border-2 border-green-500/30 text-center"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold font-orbitron text-white mb-2">AGENT REGISTERED</h2>
                                    <p className="text-gray-400 mb-6">
                                        Confirmation sent to your email. You are now cleared to form or join a squad.
                                    </p>

                                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-8 font-mono text-sm text-neon-blue">
                                        &gt; DEPLOYMENT DATE: FEB 03, 2026<br />
                                        &gt; LOCATION: P LH 101<br />
                                        &gt; STATUS: STANDBY
                                    </div>

                                    <Button asChild size="lg" className="w-full mb-3 bg-neon-blue text-black hover:bg-white border-none font-bold">
                                        <a href={`/events/rewire/team?participant_id=${participantId}`}>
                                            <Users className="w-4 h-4 mr-2" /> PROCEED TO SQUAD SETUP
                                        </a>
                                    </Button>

                                    <Button asChild size="lg" className="w-full mb-3 bg-[#25D366] text-white hover:bg-[#128C7E] border-none font-bold">
                                        <a href="https://chat.whatsapp.com/CO8iYjd3NuiKjekVUNZWiU" target="_blank" rel="noopener noreferrer">
                                            Join Mission Updates (WhatsApp)
                                        </a>
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
