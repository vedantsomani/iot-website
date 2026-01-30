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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const participantId = searchParams.get('participant_id');

        if (!participantId) {
            return NextResponse.json(
                { ok: false, message: 'Missing participant_id' },
                { status: 400 }
            );
        }

        const sheet = await getRewireSheet();
        const rows = await sheet.getRows();

        // Find participant
        const participant = rows.find(row => row.get('ParticipantID') === participantId);

        if (!participant) {
            return NextResponse.json(
                { ok: false, message: 'Participant not found' },
                { status: 404 }
            );
        }

        const status = participant.get('Status') || 'PROFILE_ONLY';
        const teamCode = participant.get('TeamCode') || '';

        const response: {
            ok: boolean;
            data: {
                participant: {
                    participant_id: string;
                    name: string;
                    email: string;
                    status: string;
                };
                team?: {
                    team_code: string;
                    members_count: number;
                };
                team_members?: Array<{ name: string; email: string }>;
            };
        } = {
            ok: true,
            data: {
                participant: {
                    participant_id: participantId,
                    name: participant.get('Name') || '',
                    email: participant.get('Email') || '',
                    status
                }
            }
        };

        // If part of a team, get team info
        if (teamCode && (status === 'CAPTAIN' || status === 'MEMBER')) {
            const teamMembers = rows.filter(row => row.get('TeamCode') === teamCode);
            response.data.team = {
                team_code: teamCode,
                members_count: teamMembers.length
            };
            response.data.team_members = teamMembers.map(m => ({
                name: m.get('Name') || '',
                email: m.get('Email') || ''
            }));
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('Status error:', error);
        return NextResponse.json(
            { ok: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
