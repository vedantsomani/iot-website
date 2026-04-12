import { Container } from '@/components/ui/Container';
import Masonry from '@/components/Masonry';
import { getGalleryImages } from '@/lib/gallery-utils';

export const metadata = {
    title: 'Gallery',
    description: 'A visual journey through our projects, events, and community.',
};

export default function GalleryPage() {
    const galleryImages = getGalleryImages();

    return (
        <div className="min-h-screen bg-dots pt-20">
            <Container className="py-20">
                <div className="text-left mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-3 tracking-tight">
                        Gallery
                    </h1>
                    <p className="text-text-secondary max-w-lg text-sm font-display">
                        Exploring our world through images and videos.
                    </p>
                </div>

                <div className="h-[200vh] w-full relative">
                    <Masonry items={galleryImages} scaleOnHover={false} />
                </div>
            </Container>
        </div>
    );
}
