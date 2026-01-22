import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { findRowByToken, extractToken } from '@/lib/sheets';

export async function POST(req: NextRequest) {
    try {
        // Verify staff session
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - please log in' },
                { status: 401 }
            );
        }

        const { scannedText } = await req.json();

        if (!scannedText) {
            return NextResponse.json(
                { error: 'No scan data provided' },
                { status: 400 }
            );
        }

        // Extract token from scanned text (could be raw token or URL)
        const token = extractToken(scannedText);

        if (!token) {
            return NextResponse.json(
                { error: 'Invalid QR code format' },
                { status: 400 }
            );
        }

        // Find the ticket row
        const row = await findRowByToken(token);

        if (!row) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            );
        }

        const status = row.get('Status');
        const teamName = row.get('TeamName');
        const track = row.get('Track');
        const existingCheckIn = row.get('CheckedInAtUTC');

        // Check if already checked in
        if (existingCheckIn) {
            return NextResponse.json(
                {
                    error: 'Already checked in',
                    teamName,
                    track,
                    checkedInAt: existingCheckIn,
                },
                { status: 409 }
            );
        }

        // Check status
        if (status === 'PENDING') {
            return NextResponse.json(
                {
                    error: 'Ticket not yet approved',
                    status: 'PENDING',
                    teamName,
                    track,
                },
                { status: 403 }
            );
        }

        if (status === 'BLOCKED') {
            const blockReason = row.get('BlockReason');
            return NextResponse.json(
                {
                    error: 'Ticket is blocked',
                    status: 'BLOCKED',
                    teamName,
                    track,
                    blockReason: blockReason || 'No reason provided',
                },
                { status: 403 }
            );
        }

        if (status !== 'APPROVED') {
            return NextResponse.json(
                {
                    error: `Invalid ticket status: ${status}`,
                    teamName,
                    track,
                },
                { status: 403 }
            );
        }

        // Perform check-in
        const checkInTime = new Date().toISOString();

        row.set('CheckedInAtUTC', checkInTime);
        row.set('CheckedInBy', session.staffId);
        await row.save();

        return NextResponse.json({
            success: true,
            teamName,
            track,
            leadName: row.get('LeadName'),
            checkedInAt: checkInTime,
        });
    } catch (error) {
        console.error('Check-in error:', error);
        return NextResponse.json(
            { error: 'Check-in failed' },
            { status: 500 }
        );
    }
}
