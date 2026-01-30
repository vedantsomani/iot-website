# Rewire Event Registration System - Setup Guide

Complete setup instructions for deploying the Rewire event registration system.

## Table of Contents

1. [Google Sheets Setup](#1-google-sheets-setup)
2. [Google Apps Script Deployment](#2-google-apps-script-deployment)
3. [Vercel Environment Variables](#3-vercel-environment-variables)
4. [Testing the System](#4-testing-the-system)
5. [Customization](#5-customization)

---

## 1. Google Sheets Setup

### Step 1: Create a New Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: "Rewire Event Registration"

### Step 2: Note the Spreadsheet ID

The spreadsheet URL looks like:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

Copy the `SPREADSHEET_ID` part - you'll need it for Apps Script.

### Step 3: The Sheets Will Be Auto-Created

The Apps Script will automatically create these sheets with headers when first run:

| Sheet Name | Purpose |
|------------|---------|
| Participants | All registered participants |
| Teams | Team information |
| Requests | Join request queue (optional) |
| Logs | System logs |

---

## 2. Google Apps Script Deployment

### Step 1: Open Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. This opens the Apps Script editor

### Step 2: Add the Code

1. Delete any existing code in `Code.gs`
2. Copy the entire contents from `apps-script/Code.gs`
3. Paste it into the Apps Script editor
4. Save (Ctrl+S or Cmd+S)

### Step 3: Configure Script Properties

1. In Apps Script, click **Project Settings** (gear icon) on the left
2. Scroll down to **Script Properties**
3. Click **Add script property**
4. Add these properties:

| Property | Value |
|----------|-------|
| `BACKEND_SECRET` | Generate a secure random string (32+ characters) |

**To generate a secure secret:**
```javascript
// Run in browser console
crypto.randomUUID() + crypto.randomUUID()
```

### Step 4: Update Configuration

In `Code.gs`, update the `CONFIG` object around line 20:

```javascript
const CONFIG = {
  EVENT_NAME: "Rewire",
  EVENT_SHORTCODE: "RW",
  TEAM_SIZE: 4,
  OTP_EXPIRY_MINUTES: 10,
  ORGANIZER_EMAILS: ["your-email@gmail.com", "co-organizer@gmail.com"],
  FROM_NAME: "IoT & Robotics Club, Bennett",
  SUPPORT_CONTACT: "+91-9876543210",
  REGISTRATION_URL: "https://your-domain.vercel.app/rewire",
  // ... rest stays the same
};
```

### Step 5: Initialize Sheets

1. In Apps Script, select `initializeAllSheets` from the function dropdown
2. Click **Run**
3. When prompted, authorize the script:
   - Click "Review permissions"
   - Select your Google account
   - Click "Advanced" > "Go to Rewire (unsafe)"
   - Click "Allow"

### Step 6: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon next to "Select type" > **Web app**
3. Configure:
   - **Description:** "Rewire Registration API v1"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. Click **Deploy**
5. Copy the **Web app URL** - this is your `APPS_SCRIPT_URL`

The URL looks like:
```
https://script.google.com/macros/s/XXXXXXXXXX/exec
```

---

## 3. Vercel Environment Variables

### Step 1: Add Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** > **Environment Variables**
2. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `APPS_SCRIPT_URL` | Your Apps Script Web App URL | All |
| `BACKEND_SECRET` | Same secret from Apps Script | All |
| `REWIRE_ADMIN_PASSWORD` | Admin dashboard password | All |

### Step 2: Local Development

Create/update `.env.local` in the Next.js project root:

```env
# Rewire Event Registration
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
BACKEND_SECRET=your-secure-secret-here
REWIRE_ADMIN_PASSWORD=your-admin-password
```

> ⚠️ **Never commit `.env.local` to git!**

### Step 3: Redeploy

After adding environment variables, trigger a redeployment:
- Push any commit, or
- Click "Redeploy" in Vercel dashboard

---

## 4. Testing the System

### Test 1: Registration Flow

1. Open `/rewire/register` in your browser
2. Fill out the registration form
3. Submit - you should:
   - See success message
   - Be redirected to `/rewire/team`
   - Receive a confirmation email
   - See your row in the Participants sheet

### Test 2: Team Creation

1. On `/rewire/team`, click "Create a Team"
2. Confirm - you should:
   - See your team code (e.g., RW-1234)
   - Receive email with the code
   - See the team in the Teams sheet

### Test 3: Team Joining

1. Open a new incognito window
2. Register a new participant
3. On the team page, click "Join a Team"
4. Enter the team code from Test 2
5. Verify:
   - Join confirmation
   - Team members count updates
   - Both participants show the team code

### Test 4: Team Completion

1. Repeat Test 3 until you have 4 members
2. Verify:
   - Team status changes to "CONFIRMED"
   - All members receive confirmation email

### Test 5: Team Full Protection

1. Try to join a full team (4 members)
2. Should see: "Team is full (4/4 members)"

### Test 6: Free Agent

1. Register a new participant
2. Click "Stay Solo"
3. Verify:
   - Status shows "Free Agent"
   - Confirmation email received

### Test 7: Admin Dashboard

1. Open `/rewire/admin`
2. Enter the REWIRE_ADMIN_PASSWORD
3. Verify stats display correctly

---

## 5. Customization

### Changing Event Details

Update `src/lib/rewire/config.ts`:

```typescript
export const REWIRE_CONFIG = {
  EVENT_NAME: "Your Event Name",
  EVENT_SHORTCODE: "YE", // 2 letters for team codes like YE-1234
  TEAM_SIZE: 4,          // Maximum team members
  // ...
};
```

Also update the same values in `apps-script/Code.gs`.

### Modifying Skills Options

Edit `SKILLS_OPTIONS` in `src/lib/rewire/config.ts`:

```typescript
SKILLS_OPTIONS: [
  "Your Skill 1",
  "Your Skill 2",
  // ...
],
```

### Changing Email Templates

Edit the email functions in `apps-script/Code.gs`:
- `sendProfileEmail()`
- `sendTeamCreatedEmail()`
- `sendMemberJoinedEmail()`
- `sendTeamConfirmedEmails()`
- `sendFreeAgentEmail()`

### Adding Custom Logo/Branding

Update the header in the page components:
- `src/app/rewire/register/page.tsx`
- `src/app/rewire/team/page.tsx`
- `src/app/rewire/admin/page.tsx`

---

## Troubleshooting

### "Server configuration error"
- Check that `APPS_SCRIPT_URL` and `BACKEND_SECRET` are set in Vercel

### "Backend service error"
- Check Apps Script deployment is active
- Verify the Web App URL is correct
- Check Apps Script execution logs

### Emails not sending
- Ensure the Google account has Gmail access
- Check Apps Script Logs sheet for errors
- Gmail has daily sending limits (100-500/day for free accounts)

### Rate limit errors
- The system limits 10 requests per minute per IP
- Wait 1 minute and try again

### Participant not found
- Ensure localStorage is not cleared
- Use the participant_id from URL if available

---

## Support

For technical issues:
- Check the Logs sheet in Google Sheets
- Review Apps Script execution logs
- Contact: {SUPPORT_CONTACT}
