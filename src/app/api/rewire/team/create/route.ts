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

function generateTeamCode(): string {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `RW-${num}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { participant_id } = body;

        if (!participant_id) {
            return NextResponse.json(
                { ok: false, message: 'Missing participant_id' },
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

        // Generate unique team code
        let teamCode = generateTeamCode();
        const existingCodes = rows.map(r => r.get('TeamCode')).filter(Boolean);
        while (existingCodes.includes(teamCode)) {
            teamCode = generateTeamCode();
        }

        // Update participant
        participant.set('Status', 'CAPTAIN');
        participant.set('TeamCode', teamCode);
        await participant.save();

        return NextResponse.json({
            ok: true,
            message: 'Team created successfully!',
            data: {
                team_code: teamCode
            }
        });

    } catch (error) {
        console.error('Create team error:', error);
        return NextResponse.json(
            { ok: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
