// POST /api/rewire/admin/stats - Get admin statistics (protected)

import { NextRequest } from 'next/server';
import {
    callAppsScript,
    checkRateLimit,
    getClientIP,
    errorResponse,
    successResponse,
    rateLimitResponse
} from '@/lib/rewire/api';
import { AdminStats } from '@/lib/rewire/types';

export async function POST(request: NextRequest) {
    // Rate limiting
    const ip = getClientIP(request);
    const { allowed } = checkRateLimit(ip);

    if (!allowed) {
        return rateLimitResponse();
    }

    try {
        const body = await request.json();
        const password = body.password?.trim();

        // Validate admin password
        const adminPassword = process.env.REWIRE_ADMIN_PASSWORD;

        if (!adminPassword) {
            return errorResponse('Admin access not configured', 500);
        }

        if (!password || password !== adminPassword) {
            return errorResponse('Invalid admin password', 401);
        }

        // Call Apps Script
        const result = await callAppsScript<AdminStats>('ADMIN_STATS', {});

        if (!result.ok) {
            return errorResponse(result.message || 'Failed to get stats', 500);
        }

        return successResponse(result.data, result.message);

    } catch (error) {
        console.error('Admin stats error:', error);
        return errorResponse('Invalid request', 400);
    }
}
