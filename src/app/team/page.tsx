import TeamMemberCard from "@/components/TeamMemberCard";

const executives = [
    { name: "Aarav Sharma", role: "President", image: "/images/member-placeholder.png", linkedin: "#", instagram: "#" },
    { name: "Sneha Gupta", role: "Vice President", image: "/images/member-placeholder.png", linkedin: "#", github: "#" },
    { name: "Rohan Verma", role: "Tech Lead", image: "/images/member-placeholder.png", linkedin: "#", github: "#", website: "#" },
    { name: "Priya Patel", role: "General Secretary", image: "/images/member-placeholder.png", linkedin: "#", instagram: "#" },
];

const departments = [
    {
        name: "Tech Team",
        description: "The brains behind the bots. Responsible for workshops, projects, and R&D.",
        members: [
            { name: "Vikram Singh", role: "Drone Lead", image: "/images/member-placeholder.png", linkedin: "#" },
            { name: "Ananya Roy", role: "IoT Specialist", image: "/images/member-placeholder.png", github: "#" },
            { name: "Karan Malhotra", role: "Robotics Engineer", image: "/images/member-placeholder.png", linkedin: "#" },
        ]
    },
    {
        name: "Management Team",
        description: "Orchestrating club operations, finances, and event logistics.",
        members: [
            { name: "Siddharth Jain", role: "Operations Head", image: "/images/member-placeholder.png", linkedin: "#" },
            { name: "Meera Iyer", role: "Treasurer", image: "/images/member-placeholder.png", linkedin: "#" },
        ]
    },
    {
        name: "PR & Outreach",
        description: "Managing collaborations, sponsorships, and campus presence.",
        members: [
            { name: "Neha Kaplan", role: "PR Head", image: "/images/member-placeholder.png", linkedin: "#", instagram: "#" },
            { name: "Arjun Reddy", role: "Outreach Lead", image: "/images/member-placeholder.png", linkedin: "#" },
        ]
    },
    {
        name: "Social Media",
        description: "The voice of the club. Managing our online presence and community engagement.",
        members: [
            { name: "Zara Khan", role: "Social Media Head", image: "/images/member-placeholder.png", instagram: "#" },
            { name: "Kabir Bedi", role: "Content Creator", image: "/images/member-placeholder.png", linkedin: "#" },
        ]
    },
    {
        name: "Multimedia & Design",
        description: "Creating visuals, after-movies, and building the brand identity.",
        members: [
            { name: "Sanya Mehra", role: "Design Head", image: "/images/member-placeholder.png", instagram: "#", website: "#" },
            { name: "Rahul Das", role: "Video Editor", image: "/images/member-placeholder.png", instagram: "#" },
        ]
    }
];

export default function TeamPage() {
    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gradient-to-b from-black to-panel-bg py-20 px-4 text-center border-b border-white/5">
                <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4 text-glow">
                    OUR <span className="text-neon-blue">TEAM</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Meet the innovators, creators, and leaders driving the IoT & Robotics Club forward.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-16">
                {/* Executive Board */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-2 bg-neon-purple rounded-full"></div>
                        <h2 className="text-3xl font-bold font-orbitron text-white">Executive Board</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {executives.map((member, index) => (
                            <TeamMemberCard key={index} member={member} />
                        ))}
                    </div>
                </div>

                {/* Departments */}
                {departments.map((dept, idx) => (
                    <div key={idx} className="mb-20">
                        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-2 bg-neon-blue rounded-full"></div>
                                <h2 className="text-3xl font-bold font-orbitron text-white">{dept.name}</h2>
                            </div>
                            <p className="text-gray-400 text-sm md:ml-4 pb-1 border-l border-gray-700 pl-4 md:border-l-0 md:pl-0">
                                {dept.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {dept.members.map((member, index) => (
                                <TeamMemberCard key={index} member={member} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
