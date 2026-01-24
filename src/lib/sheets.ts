import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import crypto from 'crypto';

// Expected headers for the sheet
export const SHEET_HEADERS = [
    'Timestamp',
    'TeamName',
    'Track',
    'LeadName',
    'LeadEmail',
    'Member2Name',
    'Member2Email',
    'Member3Name',
    'Member3Email',
    'Member4Name',
    'Member4Email',
    'LeadMobile',
    // New columns M-Q
    'TicketToken',
    'Status',
    'CheckedInAtUTC',
    'CheckedInBy',
    'BlockReason',
] as const;

export type RowData = {
    [K in (typeof SHEET_HEADERS)[number]]?: string;
};

/**
 * Get authenticated Google Sheet instance
 */
export async function getSheet(customSheetId?: string) {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = customSheetId || process.env.GOOGLE_SHEET_ID;
    const tabName = process.env.GOOGLE_SHEET_TAB;

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

    // Get sheet by tab name or default to first sheet
    // If using custom recruitment sheet, might not use same tab name logic, but defaulting to index 0 is safe
    const sheet = (tabName && !customSheetId) ? doc.sheetsByTitle[tabName] : doc.sheetsByIndex[0];

    if (!sheet) {
        throw new Error(`Sheet tab "${tabName}" not found`);
    }

    // Ensure headers exist (Only check headers if it's the main event sheet, or let valid functions handle it)
    // For legacy reasons, we keep the check here but it might be better moved to usage.
    // However, to avoid breaking changes, we'll keep the loop for SHEET_HEADERS if it's the main sheet.

    if (!customSheetId) {
        try {
            await sheet.loadHeaderRow();
            const headers = sheet.headerValues;

            // Add any missing headers
            const missingHeaders = SHEET_HEADERS.filter(h => !headers.includes(h));
            if (missingHeaders.length > 0) {
                await sheet.setHeaderRow([...headers, ...missingHeaders]);
            }
        } catch {
            // No headers exist, set all of them
            await sheet.setHeaderRow([...SHEET_HEADERS]);
        }
    }

    return sheet;
}

// Headers for the Recruitment Sheet
export const RECRUITMENT_HEADERS = [
    'Timestamp',
    'FullName',
    'Email',
    'Phone',
    'Year',
    'Branch',
    'Team',
    'Role',
    'Skills',
    'Motivation',
    'LinkedIn',
    'Portfolio',
    'ResumeURL',
    'Status'
] as const;

export type RecruitmentRowData = {
    [K in (typeof RECRUITMENT_HEADERS)[number]]?: string;
};

/**
 * Append a new recruitment application to the sheet
 */
export async function appendRecruitmentApplication(data: RecruitmentRowData) {
    const recruitmentSheetId = process.env.GOOGLE_RECRUITMENT_SHEET_ID;
    if (!recruitmentSheetId) {
        throw new Error('GOOGLE_RECRUITMENT_SHEET_ID is missing from environment variables');
    }

    // Use the specific recruitment sheet ID
    const sheet = await getSheet(recruitmentSheetId);

    // Ensure we have the correct headers on this sheet if it's empty
    try {
        await sheet.loadHeaderRow();
        const headers = sheet.headerValues;
        // Simple check: if our specific recruitment headers are missing, add them.
        // This might conflict if the same sheet is used for multiple things, 
        // but User asked to "create the lines all" for this specific sheet link.
        const missing = RECRUITMENT_HEADERS.filter(h => !headers.includes(h));
        if (missing.length > 0) {
            // If it's a fresh sheet, just set everything. 
            // If it has partial headers, append.
            if (headers.length === 0) {
                await sheet.setHeaderRow([...RECRUITMENT_HEADERS]);
            } else {
                await sheet.setHeaderRow([...headers, ...missing]);
            }
        }
    } catch {
        // No headers at all
        await sheet.setHeaderRow([...RECRUITMENT_HEADERS]);
    }

    await sheet.addRow({
        Timestamp: new Date().toISOString(),
        ...data,
        Status: 'Pending'
    });
}

/**
 * Generate a URL-safe ticket token
 */
export function generateTicketToken(): string {
    return crypto.randomBytes(16).toString('base64url');
}

/**
 * Find a row by ticket token
 */
export async function findRowByToken(
    token: string
): Promise<GoogleSpreadsheetRow<RowData> | null> {
    const sheet = await getSheet();
    const rows = await sheet.getRows<RowData>();

    return rows.find(row => row.get('TicketToken') === token) || null;
}

/**
 * Get all recruitment submissions
 */
export async function getAllSubmissions(): Promise<GoogleSpreadsheetRow<RecruitmentRowData>[]> {
    try {
        const recruitmentSheetId = process.env.GOOGLE_RECRUITMENT_SHEET_ID;
        const sheet = await getSheet(recruitmentSheetId);

        // Ensure headers are loaded
        await sheet.loadHeaderRow();
        const rows = await sheet.getRows<RecruitmentRowData>();

        // Reverse to show newest first
        return rows.reverse();
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }
}

/**
 * Extract token from raw text or URL
 * Handles both raw tokens and URLs like /ticket?t=TOKEN or full URLs
 */
export function extractToken(input: string): string | null {
    const trimmed = input.trim();

    // Check if it's a URL with t= parameter
    try {
        const url = new URL(trimmed, 'http://localhost');
        const token = url.searchParams.get('t');
        if (token) return token;
    } catch {
        // Not a valid URL, continue
    }

    // Check for ?t= pattern in non-URL strings
    const match = trimmed.match(/[?&]t=([A-Za-z0-9_-]+)/);
    if (match) return match[1];

    // Assume raw token if it looks like base64url (alphanumeric + - + _)
    if (/^[A-Za-z0-9_-]{16,32}$/.test(trimmed)) {
        return trimmed;
    }

    return null;
}
