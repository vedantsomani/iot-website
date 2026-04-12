"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, X, ExternalLink, Filter } from 'lucide-react';
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
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
                className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto card-solid rounded-2xl"
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
                <div className="relative h-72">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />

                    {/* Tags */}
                    <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                        {event.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-accent-primary/15 text-accent-primary font-mono uppercase tracking-wide">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold font-display text-white mb-4">{event.title}</h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-text-secondary text-sm">
                            <Calendar className="w-4 h-4 text-accent-primary" />
                            <span>{new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-secondary text-sm">
                            <Clock className="w-4 h-4 text-accent-secondary" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-secondary text-sm">
                            <MapPin className="w-4 h-4 text-accent-success" />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <p className="text-text-secondary mb-6 leading-relaxed">{event.description}</p>

                    {/* Gallery (for past events) */}
                    {event.gallery && event.gallery.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-white mb-3 font-display">Event Photos</h3>
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
                        event.registrationLink.startsWith('http') ? (
                            <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Event Website
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </Button>
                        ) : (
                            <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                                <a href={event.registrationLink}>
                                    Register
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </Button>
                        )
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// Upcoming event hero card — full width, dramatic
function UpcomingEventHero({ event, onClick }: { event: Event; onClick: () => void }) {
    const isExternal = event.registrationLink?.startsWith('http');

    return (
        <motion.div
            className="card-accent-left relative w-full rounded-2xl overflow-hidden min-h-[300px] md:min-h-[400px] cursor-pointer group"
            style={{ borderLeftColor: 'var(--accent-warm)' }}
            onClick={onClick}
        >
            <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="flex flex-wrap gap-2 mb-3">
                    {event.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-accent-primary/15 text-accent-primary font-mono uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="text-2xl md:text-4xl font-bold font-display text-white mb-2">{event.title}</h3>
                <div className="flex items-center gap-4 text-text-secondary text-sm mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                </div>
                <p className="text-text-secondary max-w-xl text-sm mb-5 line-clamp-2">{event.description}</p>

                <div className="flex gap-3">
                    {isExternal && (
                        <Button
                            asChild
                            size="lg"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                Register Now <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                    )}
                    <Button variant="outline" size="lg" className="border-white/20">
                        Event Details
                    </Button>
                </div>
            </div>

            {/* Registrations Open badge */}
            <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-success bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-accent-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse" />
                    Registrations Open
                </span>
            </div>
        </motion.div>
    );
}

// Year divider component
function YearDivider({ year }: { year: string }) {
    return (
        <motion.div
            className="flex items-center gap-4 my-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
        >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-default to-transparent" />
            <span className="text-xl font-bold font-display text-text-tertiary">{year}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-default to-transparent" />
        </motion.div>
    );
}

function PastEventCard({ event, onClick }: { event: Event; onClick: () => void }) {
    return (
        <motion.div
            className="card-solid rounded-xl overflow-hidden cursor-pointer group"
            onClick={onClick}
        >
            <div className="relative h-44">
                <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 text-text-tertiary text-xs mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-accent-primary transition-colors font-display line-clamp-1">
                    {event.title}
                </h3>

                <p className="text-text-tertiary text-xs line-clamp-2 mb-3">{event.description}</p>

                <div className="flex gap-1.5 flex-wrap">
                    {event.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-text-tertiary font-mono">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function EventsPage() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const events = eventsData as Event[];

    const upcomingEvents = events.filter((e) => e.type === 'upcoming');
    const pastEvents = events.filter((e) => e.type === 'past');

    // Collect all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        pastEvents.forEach(e => e.tags.forEach(t => tags.add(t)));
        return ['All', ...Array.from(tags).sort()];
    }, [pastEvents]);

    // Filter past events by tag
    const filteredPastEvents = useMemo(() => {
        if (activeFilter === 'All') return pastEvents;
        return pastEvents.filter(e => e.tags.includes(activeFilter));
    }, [pastEvents, activeFilter]);

    // Group filtered past events by year
    const pastEventsByYear = filteredPastEvents.reduce((acc, event) => {
        const year = new Date(event.date).getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(event);
        return acc;
    }, {} as Record<string, Event[]>);

    const sortedYears = Object.keys(pastEventsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <div className="min-h-screen bg-dots">
            {/* Header */}
            <Section spacing="small" className="border-b border-border-subtle">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-left"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4">
                            Events
                        </h1>
                        <p className="text-text-secondary text-lg max-w-2xl font-display">
                            Workshops, hackathons, and competitions we've hosted.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            <Section>
                <Container>
                    {/* Upcoming Events — Hero Cards */}
                    {upcomingEvents.length > 0 && (
                        <div className="mb-20">
                            <ScrollReveal>
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="text-xs font-mono uppercase tracking-widest text-accent-primary">Upcoming</span>
                                    <div className="h-px flex-1 bg-border-subtle" />
                                </div>
                            </ScrollReveal>

                            <div className="space-y-6">
                                {upcomingEvents.map((event) => (
                                    <ScrollReveal key={event.id}>
                                        <UpcomingEventHero event={event} onClick={() => setSelectedEvent(event)} />
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Events — with filter */}
                    <div>
                        <ScrollReveal>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono uppercase tracking-widest text-text-tertiary">Past Events</span>
                                    <div className="h-px flex-1 bg-border-subtle sm:hidden" />
                                </div>

                                {/* Tag Filter */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                    <Filter className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                                    {allTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setActiveFilter(tag)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                                                activeFilter === tag
                                                    ? 'bg-accent-primary text-black'
                                                    : 'bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        {sortedYears.map((year) => (
                            <div key={year}>
                                <YearDivider year={year} />
                                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {pastEventsByYear[year].map((event) => (
                                        <StaggerItem key={event.id}>
                                            <PastEventCard event={event} onClick={() => setSelectedEvent(event)} />
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        ))}

                        {filteredPastEvents.length === 0 && (
                            <div className="text-center py-20 text-text-tertiary">
                                No events found for "{activeFilter}" tag.
                            </div>
                        )}
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
