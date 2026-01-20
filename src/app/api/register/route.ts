import { NextResponse } from 'next/server';
import { transporter, mailOptions } from '@/lib/mail';
import { generateAdminNotification, generateTeamConfirmation } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { teamName, track, members } = data;

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
        to: email, // Send to this specific member
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
