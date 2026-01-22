import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_SECRET = new TextEncoder().encode(
    process.env.SESSION_SECRET || 'default-secret-change-me'
);

const COOKIE_NAME = 'staff_session';
const EXPIRY = '8h'; // Session lasts 8 hours

export interface SessionPayload {
    staffId: string;
    iat: number;
}

/**
 * Create a signed JWT session token
 */
export async function createSession(staffId: string): Promise<string> {
    return new SignJWT({ staffId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(EXPIRY)
        .sign(SESSION_SECRET);
}

/**
 * Verify a session token
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SESSION_SECRET);
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(staffId: string): Promise<void> {
    const token = await createSession(staffId);
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
    });
}

/**
 * Get and verify the current session from cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    return verifySession(token);
}

/**
 * Clear the session cookie
 */
export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}
