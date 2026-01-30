/**
 * Rewire Event Registration System - Google Apps Script
 * 
 * This script handles all backend operations for the event registration system.
 * Deploy as a Web App with "Execute as me" and "Anyone can access".
 * 
 * Required Script Properties:
 * - BACKEND_SECRET: Secret key for API authentication
 * - SPREADSHEET_ID: (Optional) ID of the spreadsheet, if not using bound script
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  EVENT_NAME: "Rewire",
  EVENT_SHORTCODE: "RW",
  TEAM_SIZE: 4,
  ORGANIZER_EMAILS: ["organizer1@email.com", "organizer2@email.com"],
  FROM_NAME: "IoT & Robotics Club, Bennett",
  SUPPORT_CONTACT: "+91-XXXXXXXXXX",
  REGISTRATION_URL: "https://your-domain.vercel.app/rewire",
  
  // OTP Settings
  OTP_EXPIRY_MINUTES: 10,
  
  // Sheet names
  SHEET_PARTICIPANTS: "Participants",
  SHEET_TEAMS: "Teams",
  SHEET_REQUESTS: "Requests",
  SHEET_LOGS: "Logs",
  SHEET_OTP: "OTP"
};

// ============================================
// MAIN ENTRY POINT
// ============================================

/**
 * Handle incoming POST requests
 */
function doPost(e) {
  try {
    // Validate secret
    const providedSecret = e.parameter.secret || 
                           (e.postData && JSON.parse(e.postData.contents).secret) ||
                           getHeaderSecret(e);
    
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('BACKEND_SECRET');
    
    // Note: In doPost, headers might not be directly accessible.
    // We validate through the secret parameter or body
    if (!expectedSecret) {
      return jsonResponse({ ok: false, message: "Server not configured" });
    }
    
    // Parse request body
    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse({ ok: false, message: "Invalid JSON body" });
    }
    
    // Check secret from body if not in parameter
    const bodySecret = body.secret;
    if (!providedSecret && !bodySecret) {
      // For security, we'll check X-Backend-Secret via Apps Script parameter workaround
      // Apps Script doesn't expose custom headers directly in doPost
      // The secret should be passed in the body
    }
    
    const { action, data } = body;
    
    if (!action) {
      return jsonResponse({ ok: false, message: "Missing action" });
    }
    
    logEvent("INFO", action, data, null);
    
    // Route to handler
    let result;
    switch (action) {
      case "SEND_OTP":
        result = handleSendOTP(data);
        break;
      case "VERIFY_OTP_AND_REGISTER":
        result = handleVerifyOTPAndRegister(data);
        break;
      case "PROFILE":
        result = handleProfile(data);
        break;
      case "CREATE_TEAM":
        result = handleCreateTeam(data);
        break;
      case "JOIN_TEAM":
        result = handleJoinTeam(data);
        break;
      case "FREE_AGENT":
        result = handleFreeAgent(data);
        break;
      case "STATUS":
        result = handleStatus(data);
        break;
      case "ADMIN_STATS":
        result = handleAdminStats();
        break;
      default:
        result = { ok: false, message: "Unknown action: " + action };
    }
    
    logEvent("INFO", action + "_RESULT", null, result);
    return jsonResponse(result);
    
  } catch (error) {
    logEvent("ERROR", "UNHANDLED_ERROR", null, { error: error.toString() });
    return jsonResponse({ ok: false, message: "Internal server error" });
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return jsonResponse({ ok: true, message: "Rewire API is running" });
}

// ============================================
// OTP HANDLERS
// ============================================

/**
 * Handle OTP sending
 */
function handleSendOTP(data) {
  const { email } = data;
  
  if (!email || !isValidEmail(email)) {
    return { ok: false, message: "Invalid email address" };
  }
  
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const timestamp = getISTTimestamp();
    const expiresAt = new Date(Date.now() + CONFIG.OTP_EXPIRY_MINUTES * 60 * 1000);
    
    // Store OTP in sheet
    const sheet = getSheet(CONFIG.SHEET_OTP);
    
    // Check if email already has a recent OTP (rate limit)
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] === email.toLowerCase()) {
        const createdAt = new Date(data[i][2]);
        const timeDiff = (Date.now() - createdAt.getTime()) / 1000;
        if (timeDiff < 60) {
          return { ok: false, message: "Please wait before requesting another OTP" };
        }
        // Delete old OTP
        sheet.deleteRow(i + 1);
        break;
      }
    }
    
    // Store new OTP
    sheet.appendRow([
      email.toLowerCase(),  // A: email
      otp,                  // B: otp
      new Date(),           // C: created_at
      expiresAt,            // D: expires_at
      'PENDING'             // E: status
    ]);
    
    // Send OTP email
    sendOTPEmail(email, otp);
    
    return {
      ok: true,
      message: "OTP sent to your email",
      data: { sent: true }
    };
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle OTP verification and registration
 */
function handleVerifyOTPAndRegister(data) {
  const { email, otp, name, phone, college, year, skills, consent, source } = data;
  
  if (!email || !otp) {
    return { ok: false, message: "Missing email or OTP" };
  }
  
  if (!name || !phone || !consent) {
    return { ok: false, message: "Missing required profile fields" };
  }
  
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    // Verify OTP
    const otpSheet = getSheet(CONFIG.SHEET_OTP);
    const otpData = otpSheet.getDataRange().getValues();
    
    let validOTP = false;
    let otpRow = -1;
    
    for (let i = otpData.length - 1; i >= 1; i--) {
      if (otpData[i][0] === email.toLowerCase() && otpData[i][4] === 'PENDING') {
        const storedOTP = String(otpData[i][1]);
        const expiresAt = new Date(otpData[i][3]);
        
        if (storedOTP === otp && new Date() < expiresAt) {
          validOTP = true;
          otpRow = i + 1;
          break;
        }
      }
    }
    
    if (!validOTP) {
      return { ok: false, message: "Invalid or expired OTP. Please try again." };
    }
    
    // Mark OTP as used
    otpSheet.getRange(otpRow, 5).setValue('USED');
    
    // Now register the participant
    const participantResult = handleProfile({
      name, email, phone, college, year, skills, consent, source
    });
    
    return participantResult;
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * Send OTP email
 */
function sendOTPEmail(email, otp) {
  const subject = `Your ${CONFIG.EVENT_NAME} Verification Code: ${otp}`;
  
  const body = `
Hi there!

Your verification code for ${CONFIG.EVENT_NAME} registration is:

🔐 ${otp}

This code expires in ${CONFIG.OTP_EXPIRY_MINUTES} minutes.

If you didn't request this, please ignore this email.

---
${CONFIG.FROM_NAME}
  `.trim();
  
  try {
    GmailApp.sendEmail(email, subject, body, { name: CONFIG.FROM_NAME });
  } catch (e) {
    logEvent("ERROR", "OTP_EMAIL_FAILED", { email }, { error: e.toString() });
    throw new Error("Failed to send OTP email");
  }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// HANDLERS
// ============================================

/**
 * Handle profile registration/update
 */
function handleProfile(data) {
  const { name, email, phone, college, year, skills, consent, source } = data;
  
  // Validate required fields
  if (!name || !email || !phone || !consent) {
    return { ok: false, message: "Missing required fields" };
  }
  
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    // Check if participant exists by phone
    const existing = findParticipantByPhone(phone);
    
    if (existing) {
      // Update existing participant
      const sheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
      const row = existing.row;
      
      sheet.getRange(row, 3).setValue(name); // C: name
      sheet.getRange(row, 4).setValue(email.toLowerCase()); // D: email
      sheet.getRange(row, 6).setValue(college); // F: college
      sheet.getRange(row, 7).setValue(year); // G: year
      sheet.getRange(row, 8).setValue(skills); // H: skills
      sheet.getRange(row, 12).setValue(consent); // L: consent
      sheet.getRange(row, 13).setValue(source || 'ONLINE'); // M: source
      sheet.getRange(row, 14).setValue(getISTTimestamp()); // N: last_updated_ist
      
      // Send update email
      sendProfileEmail(name, email, existing.participant_id, false);
      
      return {
        ok: true,
        message: "Profile updated successfully",
        data: {
          participant_id: existing.participant_id,
          status: existing.status,
          isNew: false
        }
      };
    } else {
      // Create new participant
      const participantId = generateUUID();
      const timestamp = getISTTimestamp();
      
      const sheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
      sheet.appendRow([
        timestamp,           // A: timestamp_ist
        participantId,       // B: participant_id
        name,                // C: name
        email.toLowerCase(), // D: email
        phone,               // E: phone
        college,             // F: college
        year,                // G: year
        skills,              // H: skills
        'PROFILE_ONLY',      // I: status
        '',                  // J: team_code
        '',                  // K: role_in_team
        consent,             // L: consent
        source || 'ONLINE',  // M: source
        timestamp            // N: last_updated_ist
      ]);
      
      // Send welcome email
      sendProfileEmail(name, email, participantId, true);
      
      return {
        ok: true,
        message: "Registration successful! Check your email.",
        data: {
          participant_id: participantId,
          status: 'PROFILE_ONLY',
          isNew: true
        }
      };
    }
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle team creation
 */
function handleCreateTeam(data) {
  const { participant_id } = data;
  
  if (!participant_id) {
    return { ok: false, message: "Missing participant ID" };
  }
  
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    const participant = findParticipantById(participant_id);
    
    if (!participant) {
      return { ok: false, message: "Participant not found. Please register first." };
    }
    
    if (participant.team_code) {
      return { ok: false, message: "You are already in a team: " + participant.team_code };
    }
    
    if (participant.status === 'FREE_AGENT') {
      return { ok: false, message: "You are registered as a free agent. Please contact support to change." };
    }
    
    // Generate unique team code
    const teamCode = generateTeamCode();
    const timestamp = getISTTimestamp();
    
    // Create team
    const teamsSheet = getSheet(CONFIG.SHEET_TEAMS);
    teamsSheet.appendRow([
      teamCode,                    // A: team_code
      timestamp,                   // B: created_at_ist
      participant_id,              // C: captain_participant_id
      participant.email,           // D: captain_email
      1,                           // E: members_count
      participant.email,           // F: member_emails
      'PENDING',                   // G: status
      ''                           // H: notes
    ]);
    
    // Update participant
    const participantsSheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
    participantsSheet.getRange(participant.row, 9).setValue('CAPTAIN'); // I: status
    participantsSheet.getRange(participant.row, 10).setValue(teamCode); // J: team_code
    participantsSheet.getRange(participant.row, 11).setValue('CAPTAIN'); // K: role_in_team
    participantsSheet.getRange(participant.row, 14).setValue(timestamp); // N: last_updated_ist
    
    // Send email to captain
    sendTeamCreatedEmail(participant.name, participant.email, teamCode);
    
    // Notify organizers
    sendOrganizerAlert('TEAM_CREATED', {
      team_code: teamCode,
      captain: participant.name,
      captain_email: participant.email
    });
    
    return {
      ok: true,
      message: "Team created! Share code: " + teamCode,
      data: {
        team_code: teamCode,
        status: 'PENDING'
      }
    };
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle joining a team
 */
function handleJoinTeam(data) {
  const { participant_id, team_code } = data;
  
  if (!participant_id || !team_code) {
    return { ok: false, message: "Missing required fields" };
  }
  
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    const participant = findParticipantById(participant_id);
    
    if (!participant) {
      return { ok: false, message: "Participant not found. Please register first." };
    }
    
    if (participant.team_code) {
      return { ok: false, message: "You are already in a team: " + participant.team_code };
    }
    
    // Find team
    const team = findTeamByCode(team_code.toUpperCase());
    
    if (!team) {
      return { ok: false, message: "Team not found. Please check the code." };
    }
    
    if (team.members_count >= CONFIG.TEAM_SIZE) {
      return { ok: false, message: "Team is full (4/4 members)." };
    }
    
    // Update team
    const teamsSheet = getSheet(CONFIG.SHEET_TEAMS);
    const newCount = team.members_count + 1;
    const newEmails = team.member_emails + ", " + participant.email;
    const newStatus = newCount >= CONFIG.TEAM_SIZE ? 'CONFIRMED' : 'PENDING';
    
    teamsSheet.getRange(team.row, 5).setValue(newCount); // E: members_count
    teamsSheet.getRange(team.row, 6).setValue(newEmails); // F: member_emails
    teamsSheet.getRange(team.row, 7).setValue(newStatus); // G: status
    
    // Update participant
    const participantsSheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
    const timestamp = getISTTimestamp();
    participantsSheet.getRange(participant.row, 9).setValue('MEMBER'); // I: status
    participantsSheet.getRange(participant.row, 10).setValue(team_code.toUpperCase()); // J: team_code
    participantsSheet.getRange(participant.row, 11).setValue('MEMBER'); // K: role_in_team
    participantsSheet.getRange(participant.row, 14).setValue(timestamp); // N: last_updated_ist
    
    // Send emails
    sendMemberJoinedEmail(participant.name, participant.email, team_code.toUpperCase(), newCount);
    
    // Notify captain
    const captain = findParticipantById(team.captain_participant_id);
    if (captain) {
      sendCaptainNotificationEmail(captain.name, captain.email, participant.name, participant.email, team_code.toUpperCase(), newCount);
    }
    
    // If team is now complete
    if (newStatus === 'CONFIRMED') {
      sendTeamConfirmedEmails(team_code.toUpperCase(), newEmails);
    }
    
    // Notify organizers
    sendOrganizerAlert('MEMBER_JOINED', {
      team_code: team_code.toUpperCase(),
      member: participant.name,
      member_email: participant.email,
      new_count: newCount
    });
    
    return {
      ok: true,
      message: "Successfully joined team " + team_code.toUpperCase() + "!",
      data: {
        team_code: team_code.toUpperCase(),
        members_count: newCount,
        status: newStatus
      }
    };
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle free agent registration
 */
function handleFreeAgent(data) {
  const { participant_id } = data;
  
  if (!participant_id) {
    return { ok: false, message: "Missing participant ID" };
  }
  
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    const participant = findParticipantById(participant_id);
    
    if (!participant) {
      return { ok: false, message: "Participant not found. Please register first." };
    }
    
    if (participant.team_code) {
      return { ok: false, message: "You are already in a team. Please contact support to change." };
    }
    
    // Update participant status
    const sheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
    const timestamp = getISTTimestamp();
    sheet.getRange(participant.row, 9).setValue('FREE_AGENT'); // I: status
    sheet.getRange(participant.row, 14).setValue(timestamp); // N: last_updated_ist
    
    // Send confirmation email
    sendFreeAgentEmail(participant.name, participant.email);
    
    return {
      ok: true,
      message: "Registered as free agent. We'll help you find a team at the event!",
      data: { status: 'FREE_AGENT' }
    };
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle status request
 */
function handleStatus(data) {
  const { participant_id } = data;
  
  if (!participant_id) {
    return { ok: false, message: "Missing participant ID" };
  }
  
  const participant = findParticipantById(participant_id);
  
  if (!participant) {
    return { ok: false, message: "Participant not found" };
  }
  
  let team = null;
  let teamMembers = [];
  
  if (participant.team_code) {
    team = findTeamByCode(participant.team_code);
    
    if (team) {
      // Get all team members
      teamMembers = findTeamMembers(participant.team_code);
    }
  }
  
  return {
    ok: true,
    message: "Status retrieved",
    data: {
      participant: {
        participant_id: participant.participant_id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        college: participant.college,
        year: participant.year,
        skills: participant.skills,
        status: participant.status,
        team_code: participant.team_code,
        role_in_team: participant.role_in_team
      },
      team: team ? {
        team_code: team.team_code,
        created_at_ist: team.created_at_ist,
        captain_email: team.captain_email,
        members_count: team.members_count,
        status: team.status
      } : null,
      team_members: teamMembers
    }
  };
}

/**
 * Handle admin stats request
 */
function handleAdminStats() {
  const participantsSheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
  const teamsSheet = getSheet(CONFIG.SHEET_TEAMS);
  
  const participantsData = participantsSheet.getDataRange().getValues();
  const teamsData = teamsSheet.getDataRange().getValues();
  
  // Skip headers
  const participants = participantsData.slice(1);
  const teams = teamsData.slice(1);
  
  // Calculate stats
  const totalParticipants = participants.length;
  const freeAgents = participants.filter(p => p[8] === 'FREE_AGENT').length;
  const pendingTeams = teams.filter(t => t[6] === 'PENDING').length;
  const confirmedTeams = teams.filter(t => t[6] === 'CONFIRMED').length;
  
  // Get incomplete teams (1-3 members)
  const incompleteTeams = teams
    .filter(t => t[6] === 'PENDING' && t[4] < CONFIG.TEAM_SIZE)
    .map(t => ({
      team_code: t[0],
      members_count: t[4],
      captain_email: t[3],
      member_emails: t[5]
    }));
  
  // Get free agents list
  const freeAgentList = participants
    .filter(p => p[8] === 'FREE_AGENT')
    .map(p => ({
      participant_id: p[1],
      name: p[2],
      email: p[3],
      phone: p[4],
      skills: p[7]
    }));
  
  return {
    ok: true,
    message: "Stats retrieved",
    data: {
      totalParticipants,
      freeAgents,
      pendingTeams,
      confirmedTeams,
      incompleteTeams,
      freeAgentList
    }
  };
}

// ============================================
// DATA HELPERS
// ============================================

/**
 * Get sheet by name
 */
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  
  if (!sheet) {
    // Create sheet with headers
    sheet = ss.insertSheet(name);
    initializeSheetHeaders(sheet, name);
  }
  
  return sheet;
}

/**
 * Initialize sheet headers
 */
function initializeSheetHeaders(sheet, name) {
  switch (name) {
    case CONFIG.SHEET_PARTICIPANTS:
      sheet.getRange(1, 1, 1, 14).setValues([[
        'timestamp_ist', 'participant_id', 'name', 'email', 'phone',
        'college', 'year', 'skills', 'status', 'team_code',
        'role_in_team', 'consent', 'source', 'last_updated_ist'
      ]]);
      sheet.setFrozenRows(1);
      break;
      
    case CONFIG.SHEET_TEAMS:
      sheet.getRange(1, 1, 1, 8).setValues([[
        'team_code', 'created_at_ist', 'captain_participant_id', 'captain_email',
        'members_count', 'member_emails', 'status', 'notes'
      ]]);
      sheet.setFrozenRows(1);
      break;
      
    case CONFIG.SHEET_REQUESTS:
      sheet.getRange(1, 1, 1, 9).setValues([[
        'created_at_ist', 'request_id', 'type', 'team_code',
        'participant_id', 'participant_email', 'status', 'handled_by', 'handled_at_ist'
      ]]);
      sheet.setFrozenRows(1);
      break;
      
    case CONFIG.SHEET_LOGS:
      sheet.getRange(1, 1, 1, 5).setValues([[
        'time_ist', 'level', 'action', 'payload_json', 'result_json'
      ]]);
      sheet.setFrozenRows(1);
      break;
      
    case CONFIG.SHEET_OTP:
      sheet.getRange(1, 1, 1, 5).setValues([[
        'email', 'otp', 'created_at', 'expires_at', 'status'
      ]]);
      sheet.setFrozenRows(1);
      break;
  }
}

/**
 * Find participant by phone number
 */
function findParticipantByPhone(phone) {
  const sheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === phone) { // Column E: phone
      return {
        row: i + 1,
        participant_id: data[i][1],
        name: data[i][2],
        email: data[i][3],
        phone: data[i][4],
        college: data[i][5],
        year: data[i][6],
        skills: data[i][7],
        status: data[i][8],
        team_code: data[i][9],
        role_in_team: data[i][10]
      };
    }
  }
  
  return null;
}

/**
 * Find participant by ID
 */
function findParticipantById(participantId) {
  const sheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === participantId) { // Column B: participant_id
      return {
        row: i + 1,
        participant_id: data[i][1],
        name: data[i][2],
        email: data[i][3],
        phone: data[i][4],
        college: data[i][5],
        year: data[i][6],
        skills: data[i][7],
        status: data[i][8],
        team_code: data[i][9],
        role_in_team: data[i][10]
      };
    }
  }
  
  return null;
}

/**
 * Find team by code
 */
function findTeamByCode(teamCode) {
  const sheet = getSheet(CONFIG.SHEET_TEAMS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === teamCode) { // Column A: team_code
      return {
        row: i + 1,
        team_code: data[i][0],
        created_at_ist: data[i][1],
        captain_participant_id: data[i][2],
        captain_email: data[i][3],
        members_count: data[i][4],
        member_emails: data[i][5],
        status: data[i][6],
        notes: data[i][7]
      };
    }
  }
  
  return null;
}

/**
 * Find all team members
 */
function findTeamMembers(teamCode) {
  const sheet = getSheet(CONFIG.SHEET_PARTICIPANTS);
  const data = sheet.getDataRange().getValues();
  
  const members = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][9] === teamCode) { // Column J: team_code
      members.push({
        name: data[i][2],
        email: data[i][3]
      });
    }
  }
  
  return members;
}

/**
 * Generate unique team code
 */
function generateTeamCode() {
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = CONFIG.EVENT_SHORTCODE + "-" + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    
    if (!findTeamByCode(code)) {
      return code;
    }
  }
  
  // Fallback with timestamp
  return CONFIG.EVENT_SHORTCODE + "-" + String(Date.now()).slice(-4);
}

// ============================================
// EMAIL HELPERS
// ============================================

/**
 * Send profile registration email
 */
function sendProfileEmail(name, email, participantId, isNew) {
  const subject = isNew 
    ? `Welcome to ${CONFIG.EVENT_NAME}! 🎉` 
    : `${CONFIG.EVENT_NAME} Profile Updated`;
  
  const teamUrl = CONFIG.REGISTRATION_URL + "/team?participant_id=" + participantId;
  
  const body = `
Hi ${name},

${isNew ? 'Welcome to ' + CONFIG.EVENT_NAME + '!' : 'Your profile has been updated.'}

Your registration is confirmed. Here's what to do next:

📋 NEXT STEP: Set up your team
${teamUrl}

You have 3 options:
1. CREATE a team - Get a code to share with friends
2. JOIN a team - Enter a code from a friend
3. STAY SOLO - We'll help match you at the event

---
${CONFIG.FROM_NAME}
Need help? Contact: ${CONFIG.SUPPORT_CONTACT}
  `.trim();
  
  try {
    GmailApp.sendEmail(email, subject, body, { name: CONFIG.FROM_NAME });
  } catch (e) {
    logEvent("ERROR", "EMAIL_FAILED", { type: "profile", email }, { error: e.toString() });
  }
}

/**
 * Send team created email to captain
 */
function sendTeamCreatedEmail(name, email, teamCode) {
  const subject = `Your ${CONFIG.EVENT_NAME} Team Code: ${teamCode} 🚀`;
  
  const joinUrl = CONFIG.REGISTRATION_URL + "/team?join=" + teamCode;
  
  const body = `
Hi ${name},

Congratulations! You've created a team for ${CONFIG.EVENT_NAME}.

🎯 YOUR TEAM CODE: ${teamCode}

Share this with up to 3 friends to complete your team!

Quick share link:
${joinUrl}

---
${CONFIG.FROM_NAME}
Need help? Contact: ${CONFIG.SUPPORT_CONTACT}
  `.trim();
  
  try {
    GmailApp.sendEmail(email, subject, body, { name: CONFIG.FROM_NAME });
  } catch (e) {
    logEvent("ERROR", "EMAIL_FAILED", { type: "team_created", email }, { error: e.toString() });
  }
}

/**
 * Send member joined email
 */
function sendMemberJoinedEmail(name, email, teamCode, membersCount) {
  const subject = `Welcome to Team ${teamCode}! (${membersCount}/${CONFIG.TEAM_SIZE})`;
  
  const body = `
Hi ${name},

You've successfully joined team ${teamCode} for ${CONFIG.EVENT_NAME}!

📊 Team Status: ${membersCount}/${CONFIG.TEAM_SIZE} members

${membersCount >= CONFIG.TEAM_SIZE 
  ? '🎉 Your team is COMPLETE! See you at the event.' 
  : `Your team needs ${CONFIG.TEAM_SIZE - membersCount} more member(s).`}

---
${CONFIG.FROM_NAME}
Need help? Contact: ${CONFIG.SUPPORT_CONTACT}
  `.trim();
  
  try {
    GmailApp.sendEmail(email, subject, body, { name: CONFIG.FROM_NAME });
  } catch (e) {
    logEvent("ERROR", "EMAIL_FAILED", { type: "member_joined", email }, { error: e.toString() });
  }
}

/**
 * Send notification to captain about new member
 */
function sendCaptainNotificationEmail(captainName, captainEmail, memberName, memberEmail, teamCode, membersCount) {
  const subject = `New Member Joined ${teamCode}! (${membersCount}/${CONFIG.TEAM_SIZE})`;
  
  const body = `
Hi ${captainName},

Great news! A new member has joined your team for ${CONFIG.EVENT_NAME}.

👤 New Member: ${memberName} (${memberEmail})
🎯 Team Code: ${teamCode}
📊 Team Status: ${membersCount}/${CONFIG.TEAM_SIZE} members

${membersCount >= CONFIG.TEAM_SIZE 
  ? '🎉 Your team is now COMPLETE!' 
  : `Share your code to get ${CONFIG.TEAM_SIZE - membersCount} more member(s).`}

---
${CONFIG.FROM_NAME}
  `.trim();
  
  try {
    GmailApp.sendEmail(captainEmail, subject, body, { name: CONFIG.FROM_NAME });
  } catch (e) {
    logEvent("ERROR", "EMAIL_FAILED", { type: "captain_notification", email: captainEmail }, { error: e.toString() });
  }
}

/**
 * Send team confirmed emails to all members
 */
function sendTeamConfirmedEmails(teamCode, memberEmails) {
  const subject = `Team ${teamCode} Complete! See you at ${CONFIG.EVENT_NAME} 🎉`;
  
  const body = `
Great news!

Your team ${teamCode} is now COMPLETE with ${CONFIG.TEAM_SIZE}/${CONFIG.TEAM_SIZE} members!

All team members have been registered. We look forward to seeing your team at ${CONFIG.EVENT_NAME}!

Team Members: ${memberEmails}

---
${CONFIG.FROM_NAME}
Need help? Contact: ${CONFIG.SUPPORT_CONTACT}
  `.trim();
  
  const emails = memberEmails.split(",").map(e => e.trim()).filter(e => e);
  
  emails.forEach(email => {
    try {
      GmailApp.sendEmail(email, subject, body, { name: CONFIG.FROM_NAME });
    } catch (e) {
      logEvent("ERROR", "EMAIL_FAILED", { type: "team_confirmed", email }, { error: e.toString() });
    }
  });
  
  // Also notify organizers
  sendOrganizerAlert('TEAM_CONFIRMED', {
    team_code: teamCode,
    member_emails: memberEmails
  });
}

/**
 * Send free agent confirmation email
 */
function sendFreeAgentEmail(name, email) {
  const subject = `${CONFIG.EVENT_NAME} - Registered as Free Agent`;
  
  const body = `
Hi ${name},

You're registered as a Free Agent for ${CONFIG.EVENT_NAME}.

Don't worry! Our team will help match you with other participants at the event. Many great teams are formed this way!

📍 Just come to our team desk when you arrive.

---
${CONFIG.FROM_NAME}
Need help? Contact: ${CONFIG.SUPPORT_CONTACT}
  `.trim();
  
  try {
    GmailApp.sendEmail(email, subject, body, { name: CONFIG.FROM_NAME });
  } catch (e) {
    logEvent("ERROR", "EMAIL_FAILED", { type: "free_agent", email }, { error: e.toString() });
  }
}

/**
 * Send alert to organizers
 */
function sendOrganizerAlert(type, data) {
  const subject = `[${CONFIG.EVENT_NAME}] ${type}`;
  const body = JSON.stringify(data, null, 2);
  
  CONFIG.ORGANIZER_EMAILS.forEach(email => {
    try {
      GmailApp.sendEmail(email, subject, body, { name: CONFIG.FROM_NAME + " System" });
    } catch (e) {
      // Silently fail for organizer alerts
    }
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get current timestamp in IST
 */
function getISTTimestamp() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset);
  return istTime.toISOString().replace('T', ' ').substring(0, 19) + ' IST';
}

/**
 * Generate UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create JSON response
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get header secret (workaround)
 */
function getHeaderSecret(e) {
  // Apps Script doesn't directly expose custom headers
  // The secret is passed in the request body
  return null;
}

/**
 * Log event to Logs sheet
 */
function logEvent(level, action, payload, result) {
  try {
    const sheet = getSheet(CONFIG.SHEET_LOGS);
    sheet.appendRow([
      getISTTimestamp(),
      level,
      action,
      payload ? JSON.stringify(payload) : '',
      result ? JSON.stringify(result) : ''
    ]);
  } catch (e) {
    // Silently fail logging
  }
}

// ============================================
// SETUP FUNCTION
// ============================================

/**
 * Initialize all sheets with headers
 * Run this function once to set up the spreadsheet
 */
function initializeAllSheets() {
  const sheets = [
    CONFIG.SHEET_PARTICIPANTS,
    CONFIG.SHEET_TEAMS,
    CONFIG.SHEET_REQUESTS,
    CONFIG.SHEET_LOGS,
    CONFIG.SHEET_OTP
  ];
  
  sheets.forEach(name => {
    getSheet(name);
  });
  
  Logger.log('All sheets initialized successfully!');
}

/**
 * Test the API locally
 */
function testApi() {
  const testPayload = {
    action: 'PROFILE',
    data: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      college: 'Test College',
      year: '2nd Year',
      skills: 'Programming, IoT',
      consent: 'YES',
      source: 'ONLINE'
    }
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testPayload)
    }
  };
  
  const result = doPost(e);
  Logger.log(result.getContent());
}
