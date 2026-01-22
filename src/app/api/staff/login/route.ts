import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
    try {
        const { pin } = await req.json();

        if (!pin) {
            return NextResponse.json(
                { error: 'PIN is required' },
                { status: 400 }
            );
        }

        const staffPin = process.env.STAFF_PIN;

        if (!staffPin) {
            console.error('STAFF_PIN environment variable is not set');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Constant-time comparison to prevent timing attacks
        if (pin.length !== staffPin.length || pin !== staffPin) {
            return NextResponse.json(
                { error: 'Invalid PIN' },
                { status: 401 }
            );
        }

        // Set session cookie
        await setSessionCookie('staff');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Staff login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
