"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send, CheckCircle } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function JoinPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Here you would typically send data to a backend
        setTimeout(() => {
            alert("Application submitted! We will contact you soon.");
        }, 500);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Container className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel p-12 rounded-2xl border border-neon-blue/30 inline-block"
                    >
                        <CheckCircle className="w-20 h-20 text-neon-blue mx-auto mb-6" />
                        <h2 className="text-3xl font-bold font-orbitron text-white mb-4">Application Received!</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Thanks for your interest in joining the IoT & Robotics Club.
                            Our team will review your application and get back to you shortly.
                        </p>
                        <Button onClick={() => setSubmitted(false)} variant="outline">
                            Submit Another Response
                        </Button>
                    </motion.div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <Section className="bg-gradient-to-b from-black to-panel-bg border-b border-white/5 relative overflow-hidden" spacing="small">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10" />

                <Container className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-6">
                            JOIN <span className="text-neon-blue">THE CREW</span>
                        </h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">
                            Fill out the form below to apply for membership. We recruit passionate individuals ready to build the future.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            {/* Application Form */}
            <Section>
                <Container className="max-w-3xl">
                    <motion.form
                        onSubmit={handleSubmit}
                        className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Personal Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-orbitron text-white border-b border-white/10 pb-2">
                                01. Personal Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
                                    <input required type="text" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Phone Number *</label>
                                    <input required type="tel" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="+91 98765 43210" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                                <input required type="email" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="john.doe@bennett.edu.in" />
                            </div>
                        </div>

                        {/* Academic Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-orbitron text-white border-b border-white/10 pb-2">
                                02. Academic Info
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Current Year *</label>
                                    <select required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors">
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Branch / Course *</label>
                                    <input required type="text" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="e.g. B.Tech CSE" />
                                </div>
                            </div>
                        </div>

                        {/* Club Preferences */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-orbitron text-white border-b border-white/10 pb-2">
                                03. Club Preferences
                            </h3>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Which team are you most interested in? *</label>
                                <select required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors">
                                    <option value="">Select Team</option>
                                    <option value="tech">Tech Team (IoT, Robotics, Coding)</option>
                                    <option value="design">Design Team (UI/UX, Graphics)</option>
                                    <option value="multimedia">Multimedia Team (Video, Photo)</option>
                                    <option value="social-media">Social Media Team</option>
                                    <option value="management">Management Team</option>
                                    <option value="pr">Public Relations (PR)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Technical Skills / Tools Known</label>
                                <textarea className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors h-24" placeholder="e.g. Arduino, Python, Photoshop, Premiere Pro, etc."></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Why do you want to join the club? *</label>
                                <textarea required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors h-32" placeholder="Tell us about your interests and what you hope to learn..."></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Portfolio / GitHub / LinkedIn Link (Optional)</label>
                                <input type="url" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="https://..." />
                            </div>
                        </div>

                        <Button className="w-full gap-2 text-lg py-6 mt-4">
                            Submit Application <Send className="w-5 h-5" />
                        </Button>

                    </motion.form>
                </Container>
            </Section>
        </div>
    );
}
