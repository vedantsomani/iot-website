import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/session';
import { STAFF_USERS } from '@/config/staff';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password, pin } = body;

        // Legacy PIN auth
        if (pin) {
            const validPin = process.env.STAFF_GLOBAL_PIN || '1234';
            if (pin === validPin) {
                await setSessionCookie({
                    username: 'staff',
                    role: 'head',
                    department: 'general',
                    displayName: 'Staff Member'
                });

                return NextResponse.json({
                    success: true,
                    user: {
                        username: 'staff',
                        role: 'head',
                        department: 'general'
                    }
                });
            }

            return NextResponse.json(
                { error: 'Invalid PIN' },
                { status: 401 }
            );
        }

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = STAFF_USERS.find(u => u.username === username);

        if (!user) {
            // Use time-constant comparison simulation or just return error (low risk here)
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        if (user.password !== password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Set session
        await setSessionCookie({
            username: user.username,
            role: user.role,
            department: user.department,
            displayName: user.displayName
        });

        return NextResponse.json({
            success: true,
            user: {
                username: user.username,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Staff login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
