import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    EMAIL_USER: process.env.EMAIL_USER ? '✓ SET' : '✗ NOT SET',
    EMAIL_PASS: process.env.EMAIL_PASS ? '✓ SET' : '✗ NOT SET',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ SET' : '✗ NOT SET',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? '✓ SET' : '✗ NOT SET',
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? '✓ SET' : '✗ NOT SET',
    GOOGLE_SHEET_TAB: process.env.GOOGLE_SHEET_TAB ? '✓ SET' : '✗ NOT SET',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? '✓ SET' : '✗ NOT SET',
  });
}
