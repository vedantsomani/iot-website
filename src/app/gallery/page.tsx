"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Calendar, Tag, Filter } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { galleryPhotos, allCategories, type Photo } from '@/data/gallery';
import { cn } from '@/lib/utils';

export default function GalleryPage() {
    const [filter, setFilter] = useState("All");
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    const filteredPhotos = filter === "All"
        ? galleryPhotos
        : galleryPhotos.filter(p => p.category === filter);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <Section className="bg-gradient-to-b from-black to-panel-bg border-b border-white/5 py-12 md:py-20" spacing="none">
                <Container className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4 tracking-tight">
                            LIFE AT <span className="text-neon-blue">CLUB</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
                            Snapshots of innovation, teamwork, and late-night coding sessions.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            <Section>
                <Container>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {allCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border",
                                        filter === category
                                            ? "bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="text-gray-600 text-xs font-mono uppercase tracking-widest hidden md:block">
                            {filteredPhotos.length} {filteredPhotos.length === 1 ? 'MEMORY' : 'MEMORIES'} CAPTURED
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredPhotos.map((photo) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={photo.id}
                                    className="group relative aspect-square rounded-lg overflow-hidden glass-panel border border-white/10 cursor-zoom-in"
                                    onClick={() => setSelectedPhoto(photo)}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-white font-bold font-orbitron text-sm">{photo.title}</h3>
                                        <p className="text-neon-blue text-xs mt-0.5 flex items-center gap-1.5">
                                            <Tag className="w-3 h-3" /> {photo.category}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredPhotos.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No photos found in this category.</p>
                            <Button variant="outline" className="mt-4" onClick={() => setFilter("All")}>
                                View All Photos
                            </Button>
                        </div>
                    )}
                </Container>
            </Section>

            {/* Modal */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.button
                            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/5 rounded-full hover:bg-white/20 text-white transition-colors z-[110]"
                            whileHover={{ rotate: 90 }}
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative max-w-7xl w-full h-full max-h-[90vh] flex flex-col md:flex-row rounded-lg overflow-hidden bg-black/50 border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative flex-grow h-[50vh] md:h-auto bg-black">
                                <Image
                                    src={selectedPhoto.url}
                                    alt={selectedPhoto.title}
                                    fill
                                    sizes="90vw"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="w-full md:w-[320px] bg-panel-bg p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold font-orbitron text-white mb-4 leading-tight">{selectedPhoto.title}</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-neon-blue text-sm border-b border-white/5 pb-3">
                                            <Tag className="w-4 h-4" />
                                            <span className="font-semibold">{selectedPhoto.category}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(selectedPhoto.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className="w-full mt-8"
                                    onClick={() => window.open(selectedPhoto.url, '_blank')}
                                    variant="outline"
                                >
                                    Download Image
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
