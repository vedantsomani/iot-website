import { Container } from '@/components/ui/Container';
import Masonry from '@/components/Masonry';
import { getGalleryImages } from '@/lib/gallery-utils';

export const metadata = {
    title: 'Gallery | IoT Club',
    description: 'A visual journey through our projects, events, and community.',
};

export default function GalleryPage() {
    const galleryImages = getGalleryImages();

    return (
        <div className="min-h-screen bg-black pt-20">
            <Container className="py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4 tracking-tight">
                        GALLERY <span className="text-neon-blue">FROM ZERO</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
                        Exploring our world through images and videos.
                    </p>
                </div>

                {/* Ensure explicit height for Masonry */}
                <div className="h-[200vh] w-full relative">
                    <Masonry items={galleryImages} />
                </div>
            </Container>
        </div>
    );
}
