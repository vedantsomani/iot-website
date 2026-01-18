"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Cpu, Users, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import ParticleBackground from '@/components/ParticleBackground';

// Dynamic import for 3D mascot (client-only)
const RobotMascot = dynamic(() => import('@/components/RobotMascot'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-neon-blue text-sm">Loading...</div>
    </div>
  ),
});

// Static data
const stats = [
  { icon: Users, value: '150+', label: 'Active Members' },
  { icon: Cpu, value: '25+', label: 'Projects Built' },
  { icon: Award, value: '10+', label: 'Awards Won' },
  { icon: Calendar, value: '50+', label: 'Events Hosted' },
];

const upcomingEvent = {
  title: 'RoboWeek 2026',
  date: 'Feb 15, 2026',
  description: 'A week-long celebration of robotics featuring workshops, competitions, and exhibitions.',
  image: '/images/event-placeholder.png',
};

const featuredProject = {
  title: 'Autonomous Firefighting Drone',
  description: 'A quadcopter capable of independently detecting heat signatures and extinguishing small fires.',
  image: '/images/project-drone.png',
  stats: [
    { label: 'Detection Accuracy', value: '98%' },
    { label: 'Development Time', value: '6 Months' },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Particle Background */}
        <ParticleBackground />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-[1]" />

        <div className="max-w-7xl mx-auto px-4 py-32 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-sm mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Zap className="w-4 h-4" />
                <span>Bennett University</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white mb-6 leading-tight">
                IoT &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                  Robotics
                </span>
                <br />
                Club
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                Where innovation meets passion. Build smart devices, autonomous robots, and shape the future of technology.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/join"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-neon-blue text-black font-bold rounded-lg hover:bg-white transition-all duration-300 hover:scale-105"
                >
                  Join Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold rounded-lg hover:border-neon-purple hover:text-neon-purple transition-all duration-300"
                >
                  View Projects
                </Link>
              </div>
            </motion.div>

            {/* Right: 3D Robot Mascot */}
            <motion.div
              className="h-[400px] lg:h-[500px] relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Suspense fallback={<div className="animate-pulse" />}>
                <RobotMascot />
              </Suspense>

              {/* Glow effect behind mascot */}
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-radial from-neon-blue/50 to-transparent -z-10" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-panel-bg border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StaggerItem key={index}>
                <motion.div
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <stat.icon className="w-10 h-10 text-neon-blue mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-4xl font-bold font-orbitron text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Project Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="inline-block px-3 py-1 mb-4 border border-neon-purple text-neon-purple rounded-full text-xs font-bold tracking-wider">
              PROJECT SPOTLIGHT
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-6">
                {featuredProject.title.split(' ').slice(0, 2).join(' ')}{' '}
                <span className="text-neon-purple">{featuredProject.title.split(' ').slice(2).join(' ')}</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {featuredProject.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {featuredProject.stats.map((stat, i) => (
                  <div key={i}>
                    <h4 className="text-neon-blue font-bold text-2xl mb-1">{stat.value}</h4>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/projects/fire-drone"
                className="inline-flex items-center text-white border-b-2 border-neon-purple pb-1 hover:text-neon-purple transition-colors group"
              >
                View Full Project Details
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <motion.div
                className="relative h-80 lg:h-96 rounded-2xl overflow-hidden glass-panel border border-white/10 group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Glowing border on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-neon-purple/50 transition-colors duration-300" />
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4">
              UPCOMING <span className="text-neon-blue">EVENT</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Don't miss out on our next big event. Register now to secure your spot!
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <motion.div
              className="glass-panel border border-white/10 rounded-2xl overflow-hidden max-w-4xl mx-auto"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={upcomingEvent.image}
                    alt={upcomingEvent.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-panel-bg/80 md:block hidden" />
                </div>

                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-neon-blue mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-bold">{upcomingEvent.date}</span>
                  </div>

                  <h3 className="text-2xl font-bold font-orbitron text-white mb-4">
                    {upcomingEvent.title}
                  </h3>

                  <p className="text-gray-300 mb-6">
                    {upcomingEvent.description}
                  </p>

                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neon-blue text-black font-bold rounded-lg hover:bg-white transition-colors w-fit"
                  >
                    View Event Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-6">
                LEARN. <span className="text-neon-blue">DEVELOP.</span> GROW.
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                The IoT & Robotics Club is a community of passionate students who love to build,
                experiment, and innovate. From beginner workshops to advanced R&D projects,
                we provide a platform for everyone to explore the exciting world of robotics and IoT.
              </p>

              <div className="space-y-4 mb-8">
                {['Hands-on workshops & training', 'Real-world project experience', 'National competition participation', 'Industry mentorship'].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-2 h-2 rounded-full bg-neon-blue" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-neon-blue hover:text-white transition-colors group"
              >
                Learn more about us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="glass-panel p-6 rounded-xl border border-white/10"
                    whileHover={{ y: -5 }}
                  >
                    <Cpu className="w-8 h-8 text-neon-blue mb-4" />
                    <h3 className="font-bold text-white mb-2">IoT Development</h3>
                    <p className="text-sm text-gray-400">ESP32, Arduino, Sensors & Cloud</p>
                  </motion.div>

                  <motion.div
                    className="glass-panel p-6 rounded-xl border border-white/10 mt-8"
                    whileHover={{ y: -5 }}
                  >
                    <Users className="w-8 h-8 text-neon-purple mb-4" />
                    <h3 className="font-bold text-white mb-2">Community</h3>
                    <p className="text-sm text-gray-400">150+ active student members</p>
                  </motion.div>

                  <motion.div
                    className="glass-panel p-6 rounded-xl border border-white/10"
                    whileHover={{ y: -5 }}
                  >
                    <Award className="w-8 h-8 text-green-400 mb-4" />
                    <h3 className="font-bold text-white mb-2">Competitions</h3>
                    <p className="text-sm text-gray-400">National & international events</p>
                  </motion.div>

                  <motion.div
                    className="glass-panel p-6 rounded-xl border border-white/10 mt-8"
                    whileHover={{ y: -5 }}
                  >
                    <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                    <h3 className="font-bold text-white mb-2">Innovation</h3>
                    <p className="text-sm text-gray-400">Real-world projects & research</p>
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />

        <ScrollReveal className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join our community of innovators and start your journey in robotics and IoT today.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/join"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold text-lg rounded-xl hover:bg-neon-blue transition-colors"
            >
              Join the Club
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </ScrollReveal>
      </section>
    </div>
  );
}
