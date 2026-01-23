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
import InfiniteMenu from '@/components/InfiniteMenu';

export default function GalleryPage() {
    const [filter, setFilter] = useState("All");
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    const filteredPhotos = filter === "All"
        ? galleryPhotos
        : galleryPhotos.filter(p => p.category === filter);

    const menuItems = galleryPhotos.map(photo => ({
        image: photo.url,
        link: photo.url,
        title: photo.title,
        description: photo.category
    }));

    return (
        <div className="min-h-screen">
            {/* Infinite Menu Hero */}
            <div className="h-[80vh] w-full relative">
                <div className="absolute inset-0 z-0">
                    <InfiniteMenu items={menuItems} />
                </div>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/80 flex items-end justify-center pb-20">
                    <div className="text-center z-10">
                        <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4 tracking-tight">
                            LIFE AT <span className="text-neon-blue">CLUB</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
                            Explore our world in 3D. Drag to rotate, click to view.
                        </p>
                    </div>
                </div>
            </div>



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
