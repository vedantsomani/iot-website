"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Calendar, Users } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import achievementsData from '@/data/achievements.json';

export default function AchievementsPage() {
    const [filter, setFilter] = useState<'All' | 'Competition' | 'Research'>('All');

    const filteredAchievements = (filter === 'All'
        ? achievementsData
        : achievementsData.filter(item => item.category === filter)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <main className="min-h-screen bg-dots">
            {/* Header */}
            <Section spacing="small" className="border-b border-border-subtle">
                <Container className="text-left">
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Hall of Fame
                    </motion.h1>
                    <motion.p
                        className="text-text-secondary max-w-2xl mx-auto mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Celebrating victories, research breakthroughs, and milestones.
                    </motion.p>

                    {/* Filters */}
                    <div className="flex justify-start gap-3">
                        {['All', 'Competition', 'Research'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item as 'All' | 'Competition' | 'Research')}
                                className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${filter === item
                                    ? 'bg-accent-primary text-black'
                                    : 'bg-white/5 text-text-tertiary hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </Container>
            </Section>

            <Section>
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {/* Central Line (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary/0 via-accent-primary/20 to-accent-primary/0 transform -translate-x-1/2" />

                        <AnimatePresence mode='popLayout'>
                            {filteredAchievements.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`relative ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8 md:mt-16'}`}
                                >
                                    {/* Timeline Node */}
                                    <div className={`hidden md:flex absolute top-8 w-3 h-3 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(0,212,255,0.6)] z-10
                                        ${index % 2 === 0 ? '-right-[44px]' : '-left-[44px]'}
                                    `} />

                                    <div className="card-solid rounded-xl overflow-hidden group hover:border-accent-primary/20 transition-all duration-300">
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-surface-1 to-surface-0 flex items-center justify-center">
                                                    <Trophy className="w-14 h-14 text-border-subtle" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />

                                            <div className="absolute top-3 left-3">
                                                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-mono uppercase tracking-wide border border-white/20">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 text-text-tertiary text-xs mb-2 font-mono">
                                                <Calendar className="w-3 h-3 text-accent-secondary" />
                                                <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                            </div>

                                            <h3 className="text-base font-bold font-display text-white mb-1.5 group-hover:text-accent-primary transition-colors">
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center gap-1.5 mb-3">
                                                <Award className="w-4 h-4 text-yellow-400" />
                                                <span className="text-yellow-400 font-bold text-sm">{item.result}</span>
                                            </div>

                                            <p className="text-text-tertiary text-xs leading-relaxed mb-4">
                                                {item.description}
                                            </p>

                                            {item.team.length > 0 && (
                                                <div className="border-t border-border-subtle pt-3">
                                                    <div className="flex items-center gap-1.5 text-text-tertiary text-[10px] mb-2">
                                                        <Users className="w-3 h-3" />
                                                        <span className="font-mono uppercase tracking-wide">Team</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.team.map((member, i) => (
                                                            <span key={`${member}-${i}`} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-tertiary border border-border-subtle">
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
                </Container>
            </Section>
        </main>
    );
}
