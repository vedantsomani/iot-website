import { NextResponse } from 'next/server';
import { transporter, mailOptions } from '@/lib/mail';
import { generateAdminNotification, generateTeamConfirmation } from '@/lib/email-templates';
import { getSheet, generateTicketToken, RowData } from '@/lib/sheets';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { teamName, track, members, teamLeadMobile } = data;

    // Validate required fields
    if (!teamName || !track || !members || members.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const leadEmail = members[0]?.email?.toLowerCase().trim();
    if (!leadEmail) {
      return NextResponse.json(
        { error: 'Team lead email is required' },
        { status: 400 }
      );
    }

    // Get the sheet once and reuse
    const sheet = await getSheet();

    // Check for duplicate registration by team lead email
    try {
      const rows = await sheet.getRows<RowData>();

      // Check if this email is already registered as a team lead
      const existingRow = rows.find(row => {
        const rowEmail = row.get('LeadEmail');
        return rowEmail && rowEmail.toLowerCase().trim() === leadEmail;
      });

      if (existingRow) {
        const existingToken = existingRow.get('TicketToken');
        if (existingToken) {
          // Return the existing ticket instead of creating duplicate
          return NextResponse.json({
            success: true,
            ticketUrl: `/ticket?t=${existingToken}`,
            ticketToken: existingToken,
            message: 'Team already registered',
            alreadyRegistered: true,
          });
        }
        // If row exists but no token, generate one and update the row
        const newToken = generateTicketToken();
        existingRow.set('TicketToken', newToken);
        existingRow.set('Status', 'APPROVED');
        await existingRow.save();

        return NextResponse.json({
          success: true,
          ticketUrl: `/ticket?t=${newToken}`,
          ticketToken: newToken,
          message: 'Ticket generated for existing registration',
          alreadyRegistered: true,
        });
      }
    } catch (checkError) {
      console.error('Error checking for duplicates:', checkError);
      // Continue with registration if check fails
    }

    // Generate unique ticket token for new registration
    const ticketToken = generateTicketToken();
    const timestamp = new Date().toISOString();

    // Add new row to Google Sheets
    const row = {
      Timestamp: timestamp,
      TeamName: teamName,
      Track: track,
      LeadName: members[0]?.name || '',
      LeadEmail: leadEmail,
      LeadMobile: teamLeadMobile || '',
      Member2Name: members[1]?.name || '',
      Member2Email: members[1]?.email || '',
      Member3Name: members[2]?.name || '',
      Member3Email: members[2]?.email || '',
      Member4Name: members[3]?.name || '',
      Member4Email: members[3]?.email || '',
      TicketToken: ticketToken,
      Status: 'APPROVED',
      CheckedInAtUTC: '',
      CheckedInBy: '',
      BlockReason: '',
    };

    await sheet.addRow(row);

    // Build full ticket URL for emails
    const ticketPath = `/ticket?t=${ticketToken}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const fullTicketUrl = `${baseUrl}${ticketPath}`;

    // Send Notification to Admin
    try {
      await transporter.sendMail({
        ...mailOptions,
        to: process.env.EMAIL_USER,
        subject: `REWIRE SQUAD DEPLOYED: ${teamName}`,
        html: generateAdminNotification(`NEW SQUAD DEPLOYED: ${teamName}`, {
          TeamName: teamName,
          MissionTrack: track,
          TeamLead: members[0]?.name || 'N/A',
          LeadEmail: members[0]?.email || 'N/A',
          LeadMobile: teamLeadMobile || 'N/A',
          Agent02: members[1]?.name || 'N/A',
          Agent03: members[2]?.name || 'N/A',
          Agent04: members[3]?.name || 'N/A',
          TicketURL: fullTicketUrl,
        }),
      });

      // Broadcast Confirmation to ALL Squad Members with ticket URL
      const uniqueEmails = new Set(
        members.filter((m: { email?: string }) => m.email).map((m: { email: string }) => m.email)
      );

      const emailPromises = Array.from(uniqueEmails).map(async (email) => {
        return transporter.sendMail({
          ...mailOptions,
          to: email as string,
          subject: `REWIRE MISSION CONFIRMED: ${teamName}`,
          html: generateTeamConfirmation(teamName, track, members, fullTicketUrl),
        });
      });

      await Promise.all(emailPromises);
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      // Don't fail the registration if email fails
    }

    // Return success with ticket URL
    return NextResponse.json({
      success: true,
      ticketUrl: ticketPath,
      ticketToken,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
