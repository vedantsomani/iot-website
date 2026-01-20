"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, X, ChevronRight, ExternalLink } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import eventsData from '@/data/events.json';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
    type: 'upcoming' | 'past';
    registrationLink?: string;
    gallery?: string[];
    tags: string[];
}

// Event detail modal
function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
                className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto glass-panel border border-white/10 rounded-2xl"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Event image */}
                <div className="relative h-64">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-panel-bg to-transparent" />

                    {/* Tags */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        {event.tags.map((tag) => (
                            <Badge key={tag} variant="default" className="bg-neon-blue/20 text-neon-blue px-3">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold font-orbitron text-white mb-4">{event.title}</h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Calendar className="w-5 h-5 text-neon-blue" />
                            <span>{new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Clock className="w-5 h-5 text-neon-purple" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <MapPin className="w-5 h-5 text-green-400" />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">{event.description}</p>

                    {/* Gallery (for past events) */}
                    {event.gallery && event.gallery.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white mb-3">Event Photos</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {event.gallery.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                                        <Image src={img} alt={`${event.title} photo ${i + 1}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Registration button (for upcoming events) */}
                    {event.type === 'upcoming' && event.registrationLink && (
                        <Button asChild>
                            <a
                                href={event.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Register Now
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// Year divider component
function YearDivider({ year }: { year: string }) {
    return (
        <motion.div
            className="flex items-center gap-4 my-12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
        >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-2xl font-bold font-orbitron text-white/50">{year}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
    );
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
    const isUpcoming = event.type === 'upcoming';

    return (
        <motion.div
            className={`glass-panel border rounded-xl overflow-hidden cursor-pointer group ${isUpcoming ? 'border-neon-blue/30' : 'border-white/10'
                }`}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onClick}
        >
            <div className="relative h-48">
                <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-panel-bg to-transparent" />

                {/* Event status badge */}
                <div className="absolute top-4 left-4 z-10">
                    <Badge variant={isUpcoming ? "default" : "outline"} className={isUpcoming ? "" : "text-white/70 border-white/20"}>
                        {isUpcoming ? 'Upcoming' : 'Past Event'}
                    </Badge>
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 text-neon-blue text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h3 className="text-xl font-bold font-orbitron text-white mb-2 group-hover:text-neon-blue transition-colors">
                    {event.title}
                </h3>

                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>

                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {event.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </motion.div>
    );
}

export default function EventsPage() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const events = eventsData as Event[];

    const upcomingEvents = events.filter((e) => e.type === 'upcoming');
    const pastEvents = events.filter((e) => e.type === 'past');

    // Group past events by year
    const pastEventsByYear = pastEvents.reduce((acc, event) => {
        const year = new Date(event.date).getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(event);
        return acc;
    }, {} as Record<string, Event[]>);

    const sortedYears = Object.keys(pastEventsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <div className="min-h-screen">
            {/* Header */}
            <Section className="bg-gradient-to-b from-black to-panel-bg border-b border-white/5" spacing="small">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white mb-6">
                            EVENTS & <span className="text-neon-purple">WORKSHOPS</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            From hands-on workshops to hackathons and competitions — discover what's happening at the club.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            <Section>
                <Container>
                    {/* Upcoming Events */}
                    {upcomingEvents.length > 0 && (
                        <div className="mb-20">
                            <ScrollReveal>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-12 w-2 bg-neon-blue rounded-full animate-pulse" />
                                    <h2 className="text-3xl font-bold font-orbitron text-white">Upcoming Events</h2>
                                </div>
                            </ScrollReveal>

                            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingEvents.map((event) => (
                                    <StaggerItem key={event.id}>
                                        <EventCard event={event} onClick={() => setSelectedEvent(event)} />
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </div>
                    )}

                    {/* Past Events */}
                    <div>
                        <ScrollReveal>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-2 bg-gray-500 rounded-full" />
                                <h2 className="text-3xl font-bold font-orbitron text-white">Past Events</h2>
                            </div>
                        </ScrollReveal>

                        {sortedYears.map((year) => (
                            <div key={year}>
                                <YearDivider year={year} />
                                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pastEventsByYear[year].map((event) => (
                                        <StaggerItem key={event.id}>
                                            <EventCard event={event} onClick={() => setSelectedEvent(event)} />
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Event Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
