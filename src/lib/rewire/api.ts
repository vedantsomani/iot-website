// Rewire Event - API Utilities

import { AppsScriptAction, AppsScriptResponse } from './types';
import { REWIRE_CONFIG } from './config';

/**
 * In-memory rate limiter (best-effort, resets on server restart)
 * Maps IP -> { count, windowStart }
 */
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

/**
 * Check and update rate limit for an IP
 * Returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const windowMs = REWIRE_CONFIG.RATE_LIMIT_WINDOW_MS;
    const maxRequests = REWIRE_CONFIG.RATE_LIMIT_MAX_REQUESTS;

    const record = rateLimitMap.get(ip);

    if (!record || (now - record.windowStart) > windowMs) {
        // New window
        rateLimitMap.set(ip, { count: 1, windowStart: now });
        return { allowed: true, remaining: maxRequests - 1 };
    }

    if (record.count >= maxRequests) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: maxRequests - record.count };
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
    const now = Date.now();
    const windowMs = REWIRE_CONFIG.RATE_LIMIT_WINDOW_MS;

    for (const [ip, record] of rateLimitMap.entries()) {
        if ((now - record.windowStart) > windowMs * 2) {
            rateLimitMap.delete(ip);
        }
    }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    // Vercel/Cloudflare headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    return 'unknown';
}

/**
 * Call Google Apps Script backend
 */
export async function callAppsScript<T>(
    action: AppsScriptAction,
    data: Record<string, unknown>
): Promise<AppsScriptResponse<T>> {
    const appsScriptUrl = process.env.APPS_SCRIPT_URL;
    const backendSecret = process.env.BACKEND_SECRET;

    if (!appsScriptUrl || !backendSecret) {
        console.error('Missing APPS_SCRIPT_URL or BACKEND_SECRET environment variables');
        return {
            ok: false,
            message: 'Server configuration error'
        };
    }

    try {
        const response = await fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Backend-Secret': backendSecret
            },
            body: JSON.stringify({ action, data })
        });

        if (!response.ok) {
            console.error('Apps Script error:', response.status, response.statusText);
            return {
                ok: false,
                message: 'Backend service error'
            };
        }

        const result = await response.json() as AppsScriptResponse<T>;
        return result;

    } catch (error) {
        console.error('Apps Script call failed:', error);
        return {
            ok: false,
            message: 'Failed to connect to backend service'
        };
    }
}

/**
 * Create a standardized error response
 */
export function errorResponse(message: string, status: number = 400): Response {
    return Response.json(
        { ok: false, message, error: message },
        { status }
    );
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, message: string = 'Success'): Response {
    return Response.json(
        { ok: true, message, data },
        { status: 200 }
    );
}

/**
 * Create rate limit exceeded response
 */
export function rateLimitResponse(): Response {
    return Response.json(
        { ok: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
    );
}
