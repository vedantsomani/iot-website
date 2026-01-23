"use client";

import { motion } from 'framer-motion';
import { BookOpen, Code, Video, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import ParticleBackground from '@/components/ParticleBackground';

export default function TutorialsPage() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <ParticleBackground />

            <Section className="relative z-10 pt-32 pb-20">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <Badge variant="secondary" className="mb-6">KNOWLEDGE BASE</Badge>
                        <h1 className="text-5xl md:text-7xl font-bold font-orbitron mb-6">
                            Club <span className="text-neon-blue">Tutorials</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed mb-12">
                            Master IoT, Robotics, and Embedded Systems with our curated guides and workshops.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {[
                            { icon: BookOpen, title: "Getting Started", desc: "Beginner guides to Arduino & ESP32" },
                            { icon: Code, title: "Code Labs", desc: "Python & C++ for Hardware" },
                            { icon: Video, title: "Workshop Recordings", desc: "Watch past sessions on-demand" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-8 rounded-xl border border-white/10 text-center hover:border-neon-blue/50 transition-colors group"
                            >
                                <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-neon-blue/20 transition-colors">
                                    <item.icon className="w-8 h-8 text-neon-blue" />
                                </div>
                                <h3 className="text-2xl font-bold font-orbitron mb-4">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 glass-panel border border-neon-purple/30 rounded-2xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-transparent" />
                        <div className="relative z-10">
                            <Cpu className="w-12 h-12 text-neon-purple mx-auto mb-6" />
                            <h2 className="text-3xl font-bold font-orbitron mb-4">Content Coming Soon</h2>
                            <p className="text-gray-300 max-w-lg mx-auto mb-8">
                                Our tech team is currently compiling advanced tutorials on ROS2, Computer Vision, and PCB Design. Stay tuned!
                            </p>
                            <Link href="/join" className="inline-flex items-center gap-2 text-neon-purple hover:text-white transition-colors border-b border-neon-purple pb-1 hover:border-white">
                                Become a member to access early <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </Container>
            </Section>
        </div>
    );
}
