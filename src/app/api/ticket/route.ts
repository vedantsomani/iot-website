import { NextRequest, NextResponse } from 'next/server';
import { findRowByToken } from '@/lib/sheets';

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get('t');

        if (!token) {
            return NextResponse.json(
                { error: 'Missing ticket token' },
                { status: 400 }
            );
        }

        const row = await findRowByToken(token);

        if (!row) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            );
        }

        // Return ticket information (public, no secrets)
        return NextResponse.json({
            teamName: row.get('TeamName') || '',
            track: row.get('Track') || '',
            leadName: row.get('LeadName') || '',
            leadEmail: row.get('LeadEmail') || '',
            status: row.get('Status') || 'PENDING',
            checkedInAt: row.get('CheckedInAtUTC') || null,
            checkedInBy: row.get('CheckedInBy') || null,
            blockReason: row.get('BlockReason') || null,
            registeredAt: row.get('Timestamp') || '',
        });
    } catch (error) {
        console.error('Ticket lookup error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve ticket' },
            { status: 500 }
        );
    }
}
