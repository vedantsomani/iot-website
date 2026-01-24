export type StaffRole = 'president' | 'head';
export type Department = 'research' | 'tech' | 'design-content' | 'multimedia' | 'social-media' | 'management' | 'pr';

export interface StaffUser {
    username: string;
    password: string; // Plain text for simplicity as requested ("share passwords"), could be hashed in real DB
    role: StaffRole;
    department?: Department; // If role is 'head', they need a department
    displayName: string;
}

// In a real app, passwords should be hashed or stored in env vars. 
// For this "shared password" requirement, we keep it simple conform to the request.
export const STAFF_USERS: StaffUser[] = [
    {
        username: 'president',
        password: process.env.STAFF_PASSWORD_PRESIDENT || 'iot@president',
        role: 'president',
        displayName: 'President / Vice President'
    },
    {
        username: 'head.research',
        password: process.env.STAFF_PASSWORD_RESEARCH || 'iot@research',
        role: 'head',
        department: 'research',
        displayName: 'Head of Research'
    },
    {
        username: 'head.tech',
        password: process.env.STAFF_PASSWORD_TECH || 'iot@tech',
        role: 'head',
        department: 'tech',
        displayName: 'Head of Tech'
    },
    {
        username: 'head.design-content',
        password: process.env.STAFF_PASSWORD_DESIGN_CONTENT || 'iot@design-content',
        role: 'head',
        department: 'design-content',
        displayName: 'Head of Design & Content'
    },
    {
        username: 'head.multimedia',
        password: process.env.STAFF_PASSWORD_MULTIMEDIA || 'iot@multimedia',
        role: 'head',
        department: 'multimedia',
        displayName: 'Head of Multimedia'
    },
    {
        username: 'head.social',
        password: process.env.STAFF_PASSWORD_SOCIAL || 'iot@social',
        role: 'head',
        department: 'social-media',
        displayName: 'Head of Social Media'
    },
    {
        username: 'head.mgmt',
        password: process.env.STAFF_PASSWORD_MGMT || 'iot@mgmt',
        role: 'head',
        department: 'management',
        displayName: 'Head of Management'
    },
    {
        username: 'head.pr',
        password: process.env.STAFF_PASSWORD_PR || 'iot@pr',
        role: 'head',
        department: 'pr',
        displayName: 'Head of PR'
    }
];
