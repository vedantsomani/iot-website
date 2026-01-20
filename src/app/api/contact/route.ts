import { NextResponse } from 'next/server';
import { transporter, mailOptions } from '@/lib/mail';
import { generateAdminNotification } from '@/lib/email-templates';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { name, email, message } = data;

        await transporter.sendMail({
            ...mailOptions,
            to: process.env.EMAIL_USER,
            subject: `INCOMING TRANSMISSION: ${name}`,
            html: generateAdminNotification('NEW COMMS RECEIVED', {
                SenderName: name,
                SenderEmail: email,
                Message: message
            }),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
