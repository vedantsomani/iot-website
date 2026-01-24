import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAllSubmissions } from '@/lib/sheets';

export async function GET(req: NextRequest) {
    try {
        // 1. Verify Session
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch All Data
        const allSubmissions = await getAllSubmissions();

        // 3. Transform Data (Convert Row Object to clean JSON)
        const cleanData = allSubmissions.map(row => ({
            Timestamp: row.get('Timestamp'),
            FullName: row.get('FullName'),
            Email: row.get('Email'),
            Phone: row.get('Phone'),
            Year: row.get('Year'),
            Branch: row.get('Branch'),
            Team: row.get('Team'),
            Role: row.get('Role'),
            Skills: row.get('Skills'),
            Motivation: row.get('Motivation'),
            Portfolio: row.get('Portfolio'),
            ResumeURL: row.get('ResumeURL'),
            Status: row.get('Status')
        }));

        // 4. Filter by Role
        let filteredData = cleanData;

        if (session.role === 'president') {
            // President sees everything
            filteredData = cleanData;
        } else if (session.role === 'head' && session.department) {
            // Heads see only their department
            // Note: Data source uses 'Team' column (e.g. 'tech', 'design', 'research')
            // Detailed mapping might be needed if values differ, but plan assumes exact match or close enough
            filteredData = cleanData.filter(item => {
                const team = item.Team?.toLowerCase() || '';
                const dept = session.department?.toLowerCase() || '';
                return team.includes(dept);
            });
        }

        return NextResponse.json({
            success: true,
            submissions: filteredData,
            user: {
                role: session.role,
                department: session.department,
                displayName: session.displayName
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
