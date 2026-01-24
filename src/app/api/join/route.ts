import { NextResponse } from 'next/server';
import { transporter, mailOptions } from '@/lib/mail';
import { generateAdminNotification, generateRecruitmentConfirmation } from '@/lib/email-templates';
import { appendRecruitmentApplication } from '@/lib/sheets';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const year = formData.get('year') as string;
        const branch = formData.get('branch') as string;
        const team = formData.get('team') as string;
        const role = formData.get('role') as string;
        const skills = formData.get('skills') as string;
        const motivation = formData.get('motivation') as string;
        const portfolio = formData.get('portfolio') as string;
        const linkedin = formData.get('linkedin') as string;
        const resumeFile = formData.get('resume') as File | null;

        let resumeUrl = '';



        // Upload Resume to Supabase if present
        if (resumeFile) {
            // Server-Side Security Validation
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
            const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

            if (resumeFile.size > MAX_SIZE) {
                console.error('Security Block: File too large', resumeFile.size);
                return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
            }

            if (!ALLOWED_TYPES.includes(resumeFile.type)) {
                console.error('Security Block: Invalid file type', resumeFile.type);
                return NextResponse.json({ error: 'Invalid file type. Only PDF and Images allowed.' }, { status: 400 });
            }

            console.log('Attempting to upload resume:', resumeFile.name, 'Size:', resumeFile.size);
            try {
                const fileExt = resumeFile.name.split('.').pop();
                const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
                const { data, error } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, resumeFile);

                if (error) {
                    console.error('Supabase Upload Error:', error);
                    resumeUrl = 'UPLOAD_FAILED_SUPABASE_ERROR';
                } else if (data) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('resumes')
                        .getPublicUrl(fileName);
                    resumeUrl = publicUrl;
                    console.log('Resume uploaded successfully:', resumeUrl);
                }
            } catch (uploadError) {
                console.error('Resume upload exception:', uploadError);
                resumeUrl = 'UPLOAD_FAILED_EXCEPTION';
            }
        } else {
            console.log('No resume file provided in request.');
        }

        // Store in Google Sheets
        await appendRecruitmentApplication({
            FullName: name,
            Email: email,
            Phone: phone,
            Year: year,
            Branch: branch,
            Team: team,
            Role: role,
            Skills: skills,
            Motivation: motivation,
            LinkedIn: linkedin,
            Portfolio: portfolio,
            ResumeURL: resumeUrl
        });

        // Email data object
        const applicationData = {
            FullName: name,
            Email: email,
            Phone: phone,
            Year: year,
            Branch: branch,
            Team: team,
            Role: role,
            Skills: skills,
            Motivation: motivation,
            Portfolio: portfolio,
            ResumeURL: resumeUrl
        };

        // Send Admin Notification
        await transporter.sendMail({
            ...mailOptions,
            to: process.env.EMAIL_USER,
            subject: `NEW RECRUIT APPLICATION: ${name} (${team})`,
            html: generateAdminNotification('NEW RECRUIT IDENTIFIED', applicationData),
        });

        // Send Confirmation to User
        await transporter.sendMail({
            ...mailOptions,
            to: email,
            subject: `Application Received: IoT & Robotics Club`,
            html: generateRecruitmentConfirmation(name, team, role),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Application Processing Error:', error);
        return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
    }
}
