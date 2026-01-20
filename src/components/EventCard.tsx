import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventProps {
    id: string;
    title: string;
    date: string; // e.g., "2026-01-30"
    time: string;
    location: string;
    description: string;
    image: string;
    type: string; // "Workshop", "Hackathon", "Seminar"
    isPast?: boolean;
}

export default function EventCard({ event }: { event: EventProps }) {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' });

    return (
        <div className={`group glass-panel rounded-xl overflow-hidden border border-white/10 hover:border-neon-blue/50 transition-all duration-300 flex flex-col h-full ${event.isPast ? 'opacity-70 hover:opacity-100' : ''}`}>
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!event.isPast && (
                    <div className="absolute top-0 right-0 bg-neon-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                        {event.type}
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start gap-4 mb-4">
                    <div className={`rounded-lg text-center min-w-[60px] p-2 ${event.isPast ? 'bg-white/5 text-gray-400' : 'bg-neon-blue/10 text-neon-blue'}`}>
                        <span className="block text-2xl font-bold font-orbitron">{day}</span>
                        <span className="block text-xs uppercase font-bold">{month}</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors line-clamp-2 leading-tight">
                            {event.title}
                        </h3>
                    </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                    <p className="line-clamp-2 text-gray-400 text-sm">
                        {event.description}
                    </p>

                    <div className="pt-2 space-y-2 border-t border-white/5">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Clock className="h-4 w-4 text-neon-blue flex-shrink-0" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <MapPin className="h-4 w-4 text-neon-purple flex-shrink-0" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    {event.isPast ? (
                        <button disabled className="w-full py-2.5 rounded border border-white/10 text-gray-500 text-sm cursor-not-allowed bg-white/5 font-medium">
                            Event Ended
                        </button>
                    ) : (
                        <button className="w-full py-2.5 rounded bg-neon-blue/10 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue hover:text-black hover:border-transparent transition-all text-sm font-bold tracking-wide uppercase box-glow">
                            Register Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
