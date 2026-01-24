import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const staffSession = request.cookies.get('staff_session');

    // 1. Protection for /staff/dashboard and /staff/submissions
    // (Assuming /staff/submissions might still be used or redirect to dashboard)
    if (request.nextUrl.pathname.startsWith('/staff/dashboard') || request.nextUrl.pathname.startsWith('/staff/submissions')) {
        if (!staffSession) {
            return NextResponse.redirect(new URL('/staff/login', request.url));
        }
    }

    // 2. Redirect logged-in staff away from /staff/login
    if (request.nextUrl.pathname === '/staff/login') {
        if (staffSession) {
            return NextResponse.redirect(new URL('/staff/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/staff/:path*'],
};
