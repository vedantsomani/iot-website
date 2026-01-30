// Rewire Event Configuration

export const REWIRE_CONFIG = {
    // Event Details
    EVENT_NAME: "Rewire",
    EVENT_SHORTCODE: "RW",
    TEAM_SIZE: 4,

    // Contact Information
    ORGANIZER_EMAILS: ["organizer1@email.com", "organizer2@email.com"],
    FROM_NAME: "IoT & Robotics Club, Bennett",
    SUPPORT_CONTACT: "+91-XXXXXXXXXX",

    // Messaging
    CUTOFF_TEXT: "Teams can be formed during the event if incomplete.",

    // Skills Options
    SKILLS_OPTIONS: [
        "Programming (Python/C++)",
        "Web Development",
        "Mobile App Development",
        "Machine Learning/AI",
        "Electronics/Hardware",
        "IoT/Embedded Systems",
        "Robotics",
        "3D Printing/CAD",
        "UI/UX Design",
        "Project Management",
        "Content Writing",
        "Video Editing",
        "Other"
    ],

    // Year Options
    YEAR_OPTIONS: [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Post Graduate",
        "Other"
    ],

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
    RATE_LIMIT_MAX_REQUESTS: 10, // Max 10 requests per minute per IP
} as const;

// Skills as a type for type safety
export type SkillOption = typeof REWIRE_CONFIG.SKILLS_OPTIONS[number];
export type YearOption = typeof REWIRE_CONFIG.YEAR_OPTIONS[number];
