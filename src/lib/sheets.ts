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
export async function getSheet() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;
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
    const sheet = tabName ? doc.sheetsByTitle[tabName] : doc.sheetsByIndex[0];

    if (!sheet) {
        throw new Error(`Sheet tab "${tabName}" not found`);
    }

    // Ensure headers exist
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

    return sheet;
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
