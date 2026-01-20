export interface Photo {
    id: string;
    url: string;
    title: string;
    date: string;
    category: string;
    width?: number;
    height?: number;
}

export const galleryPhotos: Photo[] = [
    {
        id: "1",
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
        title: "Drone Workshop",
        date: "2024-03-15",
        category: "Workshops"
    },
    {
        id: "2",
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        title: "Robotics Competition",
        date: "2024-02-28",
        category: "Events"
    },
    {
        id: "3",
        url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1932&auto=format&fit=crop",
        title: "IoT Hackathon",
        date: "2024-01-20",
        category: "Hackathons"
    },
    {
        id: "4",
        url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop",
        title: "Soldering Session",
        date: "2023-11-10",
        category: "Workshops"
    },
    {
        id: "5",
        url: "https://images.unsplash.com/photo-1531297461136-82eb895a5850?q=80&w=2066&auto=format&fit=crop",
        title: "Tech Talk 2023",
        date: "2023-10-05",
        category: "Events"
    },
    {
        id: "6",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
        title: "Line Follower Bot",
        date: "2023-09-15",
        category: "Projects"
    },
    {
        id: "7",
        url: "https://images.unsplash.com/photo-1593642702821-c8da6771f3c6?q=80&w=1932&auto=format&fit=crop",
        title: "Team Meeting",
        date: "2023-08-20",
        category: "Community"
    },
    {
        id: "8",
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
        title: "Cyberpunk Night",
        date: "2023-12-01",
        category: "Community"
    },
    {
        id: "9",
        url: "https://images.unsplash.com/photo-1563770095-39d468f95c42?q=80&w=1964&auto=format&fit=crop",
        title: "Component Testing",
        date: "2024-04-02",
        category: "Projects"
    }
];

export const allCategories = ["All", ...Array.from(new Set(galleryPhotos.map(p => p.category)))];
