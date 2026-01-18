import Image from "next/image";

// Using placeholder images for gallery
const images = [
    "/images/hero.png",
    "/images/event-placeholder.png",
    "/images/project-drone.png",
    "/images/event-placeholder.png",
    "/images/project-drone.png",
    "/images/hero.png",
];

export default function GalleryPage() {
    return (
        <div className="min-h-screen pb-20">
            <div className="bg-panel-bg py-20 px-4 text-center border-b border-white/5">
                <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4 text-glow">
                    MEDIA <span className="text-neon-blue">GALLERY</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Snapshots from our labs, events, and competitions.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-16">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((src, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden glass-panel border border-white/10 hover:border-neon-blue break-inside-avoid group">
                            <Image
                                src={src}
                                alt={`Gallery Image ${idx + 1}`}
                                width={600}
                                height={400}
                                className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <p className="text-white font-orbitron tracking-widest text-sm">VIEW</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
