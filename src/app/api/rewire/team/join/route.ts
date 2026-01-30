import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

async function getRewireSheet() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!email || !key || !sheetId) {
        throw new Error('Missing Google Sheets credentials');
    }

    const auth = new JWT({
        email,
        key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Rewire'];
    if (!sheet) {
        throw new Error('Rewire sheet not found');
    }

    return sheet;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { participant_id, team_code } = body;

        if (!participant_id || !team_code) {
            return NextResponse.json(
                { ok: false, message: 'Missing participant_id or team_code' },
                { status: 400 }
            );
        }

        const normalizedCode = team_code.toUpperCase().trim();

        // Validate team code format (RW-XXXX)
        if (!/^RW-\d{4}$/.test(normalizedCode)) {
            return NextResponse.json(
                { ok: false, message: 'Invalid team code format. Use RW-XXXX' },
                { status: 400 }
            );
        }

        const sheet = await getRewireSheet();
        const rows = await sheet.getRows();

        // Find participant
        const participantIndex = rows.findIndex(row => row.get('ParticipantID') === participant_id);

        if (participantIndex === -1) {
            return NextResponse.json(
                { ok: false, message: 'Participant not found' },
                { status: 404 }
            );
        }

        const participant = rows[participantIndex];
        const currentStatus = participant.get('Status');

        if (currentStatus !== 'PROFILE_ONLY') {
            return NextResponse.json(
                { ok: false, message: 'You are already in a team or registered as free agent' },
                { status: 400 }
            );
        }

        // Find team members with this code
        const teamMembers = rows.filter(row => row.get('TeamCode') === normalizedCode);

        if (teamMembers.length === 0) {
            return NextResponse.json(
                { ok: false, message: 'Team not found. Check the code and try again.' },
                { status: 404 }
            );
        }

        if (teamMembers.length >= 4) {
            return NextResponse.json(
                { ok: false, message: 'This team is already full (4 members max)' },
                { status: 400 }
            );
        }

        // Update participant
        participant.set('Status', 'MEMBER');
        participant.set('TeamCode', normalizedCode);
        await participant.save();

        return NextResponse.json({
            ok: true,
            message: 'Successfully joined the team!',
            data: {
                team_code: normalizedCode,
                members_count: teamMembers.length + 1
            }
        });

    } catch (error) {
        console.error('Join team error:', error);
        return NextResponse.json(
            { ok: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
