import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';

export type GalleryItem = {
    id: string;
    img: string;
    url: string;
    height: number;
    width: number;
    type: 'image' | 'video';
};

export const getGalleryImages = (): GalleryItem[] => {
    const galleryDir = path.join(process.cwd(), 'public/images/gallery');

    if (!fs.existsSync(galleryDir)) {
        return [];
    }

    const filenames = fs.readdirSync(galleryDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const videoExtensions = ['.mp4', '.mov', '.webm'];
    const validExtensions = [...imageExtensions, ...videoExtensions];

    const items = filenames
        .filter((file) => validExtensions.includes(path.extname(file).toLowerCase()))
        .map((file, index) => {
            const filePath = path.join(galleryDir, file);
            const relativePath = `/images/gallery/${file}`;
            const ext = path.extname(file).toLowerCase();
            const isVideo = videoExtensions.includes(ext);

            try {
                let width = 800;
                let height = 600;

                if (!isVideo) {
                    const buffer = fs.readFileSync(filePath);
                    const dimensions = sizeOf(buffer);
                    width = dimensions.width || 800;
                    height = dimensions.height || 600;
                } else {
                    // Default dimensions for video tiles (vertical-ish)
                    width = 600;
                    height = 800;
                }

                // Normalize dimensions to avoid "skyscraper" items
                // The Masonry component uses height/2, so we need reasonable heights (e.g. ~600-800)
                // We'll scale everything to a reference width of 500px
                const scaleFactor = 500 / width;
                width = 500;
                height = Math.round(height * scaleFactor);

                return {
                    id: `gallery-${index}-${file}`,
                    img: relativePath,
                    url: '#',
                    width,
                    height,
                    type: isVideo ? 'video' : 'image',
                };
            } catch (e) {
                console.error(`Error processing file ${file}:`, e);
                // Fallback to default dimensions if error occurs (e.g. unknown format or read error)
                // ensure we show the file anyway
                return {
                    id: `gallery-${index}-${file}`,
                    img: relativePath,
                    url: '#',
                    width: 500,
                    height: 500,
                    type: isVideo ? 'video' : 'image',
                };
            }
        })
        .filter((item): item is GalleryItem => item !== null);

    return items;
};
