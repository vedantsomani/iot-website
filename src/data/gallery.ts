import achievementsData from '@/data/achievements.json';
import eventsData from '@/data/events.json';
import projectsData from '@/data/projects.json';

export interface Photo {
    id: string;
    url: string;
    title: string;
    date: string;
    category: string;
    width?: number;
    height?: number;
}

const achievementPhotos: Photo[] = achievementsData.filter(a => a.image).map(a => ({
    id: `ach-${a.id}`,
    url: a.image,
    title: a.title,
    date: a.date,
    category: 'Achievement'
}));

const eventPhotos: Photo[] = eventsData.flatMap(e =>
    (e.gallery || []).map((img, i) => ({
        id: `evt-${e.id}-${i}`,
        url: img,
        title: e.title,
        date: e.date,
        category: 'Event'
    }))
).concat(eventsData.filter(e => e.image && !e.image.includes('placeholder')).map(e => ({
    id: `evt-thumb-${e.id}`,
    url: e.image,
    title: e.title,
    date: e.date,
    category: 'Event'
})));

const projectPhotos: Photo[] = projectsData.filter(p => p.image).map(p => ({
    id: `proj-${p.slug}`,
    url: p.image,
    title: p.title,
    date: '2024-01-20', // Default date if missing
    category: 'Project'
}));

export const galleryPhotos: Photo[] = [
    {
        id: "gallery-1",
        url: "/images/gallery/IMG_2803.JPG",
        title: "Club Activities",
        date: "2024-01-20",
        category: "Community"
    },
    {
        id: "gallery-2",
        url: "/images/gallery/IMG_2819.JPG",
        title: "Team Collaboration",
        date: "2024-01-20",
        category: "Community"
    },
    {
        id: "gallery-3",
        url: "/images/gallery/IMG_2829.JPG",
        title: "Workshop Vibes",
        date: "2024-01-20",
        category: "Workshops"
    },
    {
        id: "gallery-4",
        url: "/images/gallery/IMG_2899.JPG",
        title: "Innovation Hub",
        date: "2024-01-20",
        category: "Projects"
    },
    ...achievementPhotos,
    ...eventPhotos,
    ...projectPhotos
];

export const allCategories = ["All", ...Array.from(new Set(galleryPhotos.map(p => p.category)))];
