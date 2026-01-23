"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Star, Calendar, Users, ChevronRight } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import achievementsData from '@/data/achievements.json';

export default function AchievementsPage() {
    const [filter, setFilter] = useState<'All' | 'Competition' | 'Research'>('All');

    const filteredAchievements = (filter === 'All'
        ? achievementsData
        : achievementsData.filter(item => item.category === filter)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <main className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px]" />
            </div>

            <Container className="relative z-10">
                <Section>
                    <div className="text-center mb-16">
                        <motion.h1
                            className="text-4xl md:text-6xl font-black font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Hall of Fame
                        </motion.h1>
                        <motion.p
                            className="text-lg text-gray-400 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Celebrating the victories, research breakthroughs, and milestones of our exceptional members.
                        </motion.p>
                    </div>

                    {/* Filters */}
                    <div className="flex justify-center gap-4 mb-12">
                        {['All', 'Competition', 'Research'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item as any)}
                                className={`px-6 py-2 rounded-full font-orbitron text-sm transition-all duration-300 ${filter === item
                                    ? 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,243,255,0.4)]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Timeline Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                        {/* Central Line (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue/0 via-neon-blue/30 to-neon-blue/0 transform -translate-x-1/2" />

                        <AnimatePresence mode='popLayout'>
                            {filteredAchievements.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`relative ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12 md:mt-24'}`}
                                >
                                    {/* Timeline Node (Desktop) */}
                                    <div className={`hidden md:flex absolute top-8 w-4 h-4 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.8)] z-10
                                        ${index % 2 === 0 ? '-right-[56px]' : '-left-[56px]'}
                                    `} />

                                    <div className="glass-panel border border-white/10 rounded-xl overflow-hidden group hover:border-neon-blue/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]">

                                        {/* Image Section */}
                                        <div className="relative h-64 overflow-hidden">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                                                    <Trophy className="w-16 h-16 text-white/10" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-panel-bg via-transparent to-transparent opacity-90" />

                                            {/* Badge */}
                                            <div className="absolute top-4 left-4">
                                                <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-neon-blue/30 text-neon-blue">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 relative">
                                            <div className="flex items-center gap-3 text-gray-400 text-sm mb-3 font-mono">
                                                <Calendar className="w-4 h-4 text-neon-purple" />
                                                <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                            </div>

                                            <h3 className="text-xl font-bold font-orbitron text-white mb-2 group-hover:text-neon-blue transition-colors">
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center gap-2 mb-4">
                                                <Award className="w-5 h-5 text-yellow-400" />
                                                <span className="text-yellow-400 font-bold">{item.result}</span>
                                            </div>

                                            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                                                {item.description}
                                            </p>

                                            {item.team.length > 0 && (
                                                <div className="border-t border-white/10 pt-4">
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                                        <Users className="w-4 h-4" />
                                                        <span className="font-semibold">Team Members</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.team.map((member, i) => (
                                                            <span key={`${member}-${i}`} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                                                                {member}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Section>
            </Container>
        </main>
    );
}
