import { NextResponse } from 'next/server';
import { transporter, mailOptions } from '@/lib/mail';
import { generateAdminNotification, generateTeamConfirmation } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { teamName, track, members } = data;

    // 0. Save to Google Sheets (Non-blocking or blocking depending on requirement, let's make it blocking for data integrity)
    try {
      if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
        const { GoogleSpreadsheet } = await import('google-spreadsheet');
        const { JWT } = await import('google-auth-library');

        const serviceAccountAuth = new JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0]; // Assuming first sheet

        // Prepare row data
        const timestamp = new Date().toISOString();
        const row = {
          Timestamp: timestamp,
          TeamName: teamName,
          Track: track,
          LeadName: members[0].name,
          LeadEmail: members[0].email,
          Member2Name: members[1].name,
          Member2Email: members[1].email,
          Member3Name: members[2].name,
          Member3Email: members[2].email,
          Member4Name: members[3].name,
          Member4Email: members[3].email,
        };

        await sheet.addRow(row);
      } else {
        console.warn("Google Sheets credentials missing. Skipping Sheet update.");
      }
    } catch (sheetError) {
      console.error("Failed to save to Google Sheets:", sheetError);
      // We don't block the email sending if sheets fail, but we log it.
    }

    // 1. Send Notification to Admin
    await transporter.sendMail({
      ...mailOptions,
      to: process.env.EMAIL_USER,
      subject: `NEW OPERATIVES ENLISTED: ${teamName}`,
      html: generateAdminNotification(`NEW SQUAD DEPLOYED: ${teamName}`, {
        TeamName: teamName,
        MissionTrack: track,
        TeamLead: members[0].name,
        LeadEmail: members[0].email,
        Agent02: members[1].name,
        Agent03: members[2].name,
        Agent04: members[3].name,
      }),
    });

    // 2. Broadcast Confirmation to ALL Squad Members
    // Using a Set to avoid duplicate emails to the same person if entered twice (though validation should prevent this)
    const uniqueEmails = new Set(members.map((m: any) => m.email));

    const emailPromises = Array.from(uniqueEmails).map(async (email) => {
      return transporter.sendMail({
        ...mailOptions,
        to: email as string,
        subject: `MISSION CONFIRMED: ${teamName}`,
        html: generateTeamConfirmation(teamName, track, members),
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
