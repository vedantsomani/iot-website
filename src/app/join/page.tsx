"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Cpu, Trophy, Calendar, MessageCircle, Zap } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';

const benefits = [
    {
        icon: Cpu,
        title: 'Hands-on Learning',
        description: 'Work with real hardware like ESP32, Arduino, sensors, motors, and drones.',
    },
    {
        icon: Users,
        title: 'Amazing Community',
        description: 'Connect with 150+ passionate students who share your interests.',
    },
    {
        icon: Trophy,
        title: 'Competitions',
        description: 'Represent Bennett at national and international robotics competitions.',
    },
    {
        icon: Calendar,
        title: 'Events & Workshops',
        description: 'Regular workshops, hackathons, and tech talks from industry experts.',
    },
    {
        icon: MessageCircle,
        title: 'Mentorship',
        description: 'Get guidance from senior members and faculty advisors.',
    },
    {
        icon: Zap,
        title: 'Real Projects',
        description: 'Build portfolio-worthy projects that solve real-world problems.',
    },
];

const steps = [
    {
        number: '01',
        title: 'Fill the Form',
        description: 'Complete our online membership form with your details and interests.',
    },
    {
        number: '02',
        title: 'Attend Orientation',
        description: 'Come to our next general body meeting or orientation workshop.',
    },
    {
        number: '03',
        title: 'Join a Team',
        description: 'Pick a department that matches your skills and interests.',
    },
    {
        number: '04',
        title: 'Start Building',
        description: 'Dive into projects, workshops, and club activities!',
    },
];

const faqs = [
    {
        q: 'Do I need prior experience in robotics or IoT?',
        a: 'Not at all! We welcome members of all skill levels. Our beginner workshops will help you get started.',
    },
    {
        q: 'Is there a membership fee?',
        a: 'There may be a nominal semester fee to cover materials and event costs. Details are shared during orientation.',
    },
    {
        q: 'How much time commitment is expected?',
        a: 'It depends on your involvement. Active project teams meet 2-3 times a week, but casual members can attend monthly events.',
    },
    {
        q: 'Can I join multiple teams?',
        a: 'Yes! Many members contribute to both technical and non-technical teams.',
    },
];

export default function JoinPage() {
    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <section className="bg-gradient-to-b from-black to-panel-bg py-24 px-4 text-center border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10" />

                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white mb-6 text-glow">
                        JOIN <span className="text-neon-blue">US</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">
                        Ready to build autonomous robots, smart IoT systems, and be part of an amazing tech community?
                    </p>

                    <motion.a
                        href="https://forms.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-neon-blue text-black font-bold text-lg rounded-xl hover:bg-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Apply for Membership
                        <ArrowRight className="w-6 h-6" />
                    </motion.a>
                </motion.div>
            </section>

            {/* Benefits */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-orbitron text-white mb-4">
                            Why Join the <span className="text-neon-purple">Club?</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Being part of the IoT & Robotics Club opens doors to learning, networking, and hands-on experience.
                        </p>
                    </ScrollReveal>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, i) => (
                            <StaggerItem key={i}>
                                <motion.div
                                    className="glass-panel p-6 rounded-xl border border-white/10 h-full"
                                    whileHover={{ y: -5, borderColor: 'rgba(0, 212, 255, 0.3)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <benefit.icon className="w-10 h-10 text-neon-blue mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                                    <p className="text-gray-400">{benefit.description}</p>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* How to Join */}
            <section className="py-24 bg-panel-bg border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-orbitron text-white mb-4">
                            How to <span className="text-neon-blue">Join</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Becoming a member is easy. Just follow these simple steps.
                        </p>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <motion.div
                                    className="relative text-center"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-6xl font-bold font-orbitron text-neon-blue/20 mb-4">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-gray-400 text-sm">{step.description}</p>

                                    {/* Connector line */}
                                    {i < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 right-0 w-full h-px bg-gradient-to-r from-neon-blue/30 to-transparent translate-x-1/2" />
                                    )}
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-orbitron text-white mb-4">
                            Frequently Asked <span className="text-neon-purple">Questions</span>
                        </h2>
                    </ScrollReveal>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <ScrollReveal key={i} delay={i * 0.05}>
                                <motion.div
                                    className="glass-panel p-6 rounded-xl border border-white/10"
                                    whileHover={{ borderColor: 'rgba(189, 0, 255, 0.3)' }}
                                >
                                    <h3 className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-neon-purple flex-shrink-0 mt-0.5" />
                                        {faq.q}
                                    </h3>
                                    <p className="text-gray-400 pl-8">{faq.a}</p>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/50" />

                <ScrollReveal className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Fill out the membership form and we'll reach out with next steps.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a
                            href="https://forms.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-bold text-lg rounded-xl hover:bg-neon-blue transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Apply Now
                            <ArrowRight className="w-6 h-6" />
                        </motion.a>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-10 py-5 border border-white/20 text-white font-bold text-lg rounded-xl hover:border-white hover:bg-white/10 transition-colors"
                        >
                            Have Questions? Contact Us
                        </Link>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}
