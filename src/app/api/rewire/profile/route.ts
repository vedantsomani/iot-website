import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { transporter, mailOptions } from '@/lib/mail';
import { v4 as uuidv4 } from 'uuid';

// Rewire registration headers
const REWIRE_HEADERS = [
    'Timestamp',
    'ParticipantID',
    'Name',
    'Email',
    'Phone',
    'Skills',
    'Status',
    'TeamCode',
    'Consent',
    'Source'
] as const;

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

    // Try to get "Rewire" sheet, or create it
    let sheet = doc.sheetsByTitle['Rewire'];

    if (!sheet) {
        // Create the sheet if it doesn't exist
        sheet = await doc.addSheet({ title: 'Rewire', headerValues: [...REWIRE_HEADERS] });
    } else {
        // Ensure headers exist
        try {
            await sheet.loadHeaderRow();
            const headers = sheet.headerValues;
            const missing = REWIRE_HEADERS.filter(h => !headers.includes(h));
            if (missing.length > 0) {
                if (headers.length === 0) {
                    await sheet.setHeaderRow([...REWIRE_HEADERS]);
                } else {
                    await sheet.setHeaderRow([...headers, ...missing]);
                }
            }
        } catch {
            await sheet.setHeaderRow([...REWIRE_HEADERS]);
        }
    }

    return sheet;
}

async function sendConfirmationEmail(name: string, email: string) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111; border-radius: 12px; padding: 30px; border: 1px solid #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #00d4ff; margin: 0; font-size: 28px; }
        .header p { color: #888; margin-top: 5px; }
        .content { line-height: 1.8; }
        .highlight { background: linear-gradient(135deg, #00d4ff20, #bd00ff20); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00d4ff; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; color: #666; font-size: 12px; }
        a { color: #00d4ff; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 REWIRE 2026</h1>
            <p>Agent Registration Confirmed</p>
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your registration for <strong>Rewire 2026</strong> has been confirmed. You are now cleared for deployment.</p>
            
            <div class="highlight">
                <strong>📅 Mission Date:</strong> February 3, 2026<br>
                <strong>📍 Location:</strong> Bennett University, P LH 101<br>
                <strong>⏰ Reporting Time:</strong> 6:30 PM
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Form or join a squad (team of 4)</li>
                <li>Join our WhatsApp group for updates</li>
                <li>Review the mission protocols on the event page</li>
            </ul>
            
            <p>See you at the mission, Agent!</p>
        </div>
        <div class="footer">
            <p>IoT & Robotics Club, Bennett University</p>
            <p><a href="https://iotbu.vercel.app/events/rewire">Visit Event Page</a></p>
        </div>
    </div>
</body>
</html>
    `.trim();

    await transporter.sendMail({
        ...mailOptions,
        to: email,
        subject: '🔐 Rewire 2026 - Registration Confirmed!',
        html
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, skills, consent, source } = body;

        // Basic validation
        if (!name || !email || !phone || !consent) {
            return NextResponse.json(
                { ok: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { ok: false, message: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Phone validation (10 digit Indian number)
        const cleanPhone = phone.replace(/[\s-]/g, '').replace(/^\+91/, '');
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
            return NextResponse.json(
                { ok: false, message: 'Invalid phone number' },
                { status: 400 }
            );
        }

        // Get sheet
        const sheet = await getRewireSheet();

        // Check if already registered by phone or email
        const rows = await sheet.getRows();
        const existing = rows.find(row =>
            row.get('Phone') === cleanPhone ||
            row.get('Email')?.toLowerCase() === email.toLowerCase()
        );

        if (existing) {
            // Return existing participant ID
            return NextResponse.json({
                ok: true,
                message: 'Already registered',
                data: {
                    participant_id: existing.get('ParticipantID'),
                    name: existing.get('Name'),
                    status: existing.get('Status')
                }
            });
        }

        // Generate participant ID
        const participantId = uuidv4();
        const timestamp = new Date().toISOString();

        // Add to sheet
        await sheet.addRow({
            Timestamp: timestamp,
            ParticipantID: participantId,
            Name: name.trim(),
            Email: email.toLowerCase().trim(),
            Phone: cleanPhone,
            Skills: Array.isArray(skills) ? skills.join(', ') : skills || '',
            Status: 'PROFILE_ONLY',
            TeamCode: '',
            Consent: consent ? 'Yes' : 'No',
            Source: source || 'ONLINE'
        });

        // Send confirmation email
        try {
            await sendConfirmationEmail(name.trim(), email.toLowerCase().trim());
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail registration if email fails
        }

        return NextResponse.json({
            ok: true,
            message: 'Registration successful! Check your email for confirmation.',
            data: {
                participant_id: participantId,
                name: name.trim(),
                status: 'PROFILE_ONLY'
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { ok: false, message: 'Server error. Please try again later.' },
            { status: 500 }
        );
    }
}
