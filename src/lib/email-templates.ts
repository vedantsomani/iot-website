export const generateAdminNotification = (title: string, data: Record<string, string>) => {
  const logoUrl = 'https://iotbu.vercel.app/logo-iot.png';
  
  const rows = Object.entries(data).map(([key, value]) => `
    <tr>
      <td style="padding: 12px 14px; color: #888888; font-size: 12px; text-transform: capitalize; border-bottom: 1px solid #2a2a2a; word-break: break-word;">${key.replace(/([A-Z])/g, ' $1').trim()}</td>
      <td style="padding: 12px 14px; color: #ffffff; font-weight: 500; text-align: right; border-bottom: 1px solid #2a2a2a; word-break: break-all; font-size: 13px;">${value}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="x-apple-disable-message-reformatting"/>
        <meta name="format-detection" content="telephone=no, address=no, email=no, date=no, url=no"/>
        <title>Admin Notification - IoT &amp; Robotics Club</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          @media only screen and (max-width: 620px) {
            .mobile-full-width { width: 100% !important; max-width: 100% !important; }
            .mobile-padding { padding-left: 12px !important; padding-right: 12px !important; }
          }
        </style>
      </head>
      <body style="background-color: #0a0a0a; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 0; margin: 0; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0a0a0a;">
          <tr>
            <td align="center" style="padding: 16px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background: #111111; border-radius: 12px; overflow: hidden; border: 1px solid #222222;" class="mobile-full-width">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: #0a0a0a; padding: 28px 20px; text-align: center; border-bottom: 2px solid #00d4ff;" class="mobile-padding">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <img src="${logoUrl}" alt="IoT" width="60" height="60" style="display: block; border-radius: 50%;" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600; letter-spacing: 1px;">IoT &amp; Robotics Club</h1>
                          <p style="color: #00d4ff; font-size: 11px; margin: 5px 0 0 0; font-weight: 500; letter-spacing: 2px;">ADMIN NOTIFICATION</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Notification Type -->
                <tr>
                  <td style="background: rgba(0,212,255,0.1); padding: 12px 16px; border-bottom: 1px solid #333;" class="mobile-padding">
                    <span style="color: #00d4ff; font-weight: 600; font-size: 14px;">📬 ${title}</span>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 20px 16px;" class="mobile-padding">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
                      ${rows}
                    </table>
                    
                    <p style="color: #666666; font-size: 11px; text-align: center; margin: 16px 0 0 0;">
                      Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #0a0a0a; padding: 16px; text-align: center; border-top: 1px solid #222;">
                    <p style="color: #00d4ff; font-size: 11px; margin: 0 0 6px 0;">
                      📷 <a href="https://www.instagram.com/iot_and_robotics_bu/" style="color: #00d4ff; text-decoration: none;">Instagram</a> &nbsp;•&nbsp; 💼 <a href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" style="color: #00d4ff; text-decoration: none;">LinkedIn</a>
                    </p>
                    <p style="color: #444444; font-size: 10px; margin: 0;">
                      IoT &amp; Robotics Club • Bennett University
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const generateTeamConfirmation = (teamName: string, track: string, members: any[], ticketUrl?: string) => {
  const logoUrl = 'https://iotbu.vercel.app/logo-iot.png';
  
  const memberList = members.map((m, i) => `
    <tr style="${i < members.length - 1 ? 'border-bottom: 1px solid #252525;' : ''}">
      <td style="padding: 12px 8px; text-align: center; width: 40px;">
        <table cellpadding="0" cellspacing="0" border="0" align="center">
          <tr>
            <td style="width: 32px; height: 32px; background: ${i === 0 ? '#bd00ff' : '#2a2a2a'}; border-radius: 50%; text-align: center; color: #fff; font-weight: 700; font-size: 13px;">${i + 1}</td>
          </tr>
        </table>
      </td>
      <td style="padding: 12px 6px;">
        <p style="color: #ffffff; font-weight: 600; font-size: 14px; margin: 0 0 2px 0;">${m.name}</p>
        <p style="color: #666666; font-size: 11px; margin: 0; word-break: break-all;">${m.email}</p>
      </td>
      <td style="padding: 12px 8px; text-align: right;">
        <span style="background: ${i === 0 ? '#bd00ff33' : '#1a1a1a'}; color: ${i === 0 ? '#d580ff' : '#666'}; padding: 4px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; letter-spacing: 0.5px; border: 1px solid ${i === 0 ? '#bd00ff44' : '#2a2a2a'}; display: inline-block;">${i === 0 ? 'LEAD' : 'MEMBER'}</span>
      </td>
    </tr>
  `).join('');

  // Generate QR code image URL using QR Server API (free, no authentication)
  const qrImageUrl = ticketUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketUrl)}&bgcolor=ffffff&color=000000`
    : '';

  const ticketSection = ticketUrl ? `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 24px;">
      <tr>
        <td style="padding: 24px 16px; background: #1a1a2e; border: 1px solid #2a2a2a; border-radius: 12px; text-align: center;">
          <p style="color: #bd00ff; font-size: 11px; margin: 0 0 6px 0; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Event Pass</p>
          <p style="color: #ffffff; font-size: 14px; margin: 0 0 20px 0; font-weight: 500;">Present this QR code at check-in</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center">
            <tr>
              <td style="background: #ffffff; padding: 12px; border-radius: 12px;">
                <img src="${qrImageUrl}" alt="Ticket QR Code" width="140" height="140" style="display: block; max-width: 100%;" />
              </td>
            </tr>
          </table>
          <p style="color: #555555; font-size: 12px; margin: 16px 0 0 0;">Scan at venue entrance</p>
        </td>
      </tr>
    </table>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="x-apple-disable-message-reformatting"/>
        <meta name="format-detection" content="telephone=no, address=no, email=no, date=no, url=no"/>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <style>
          table { border-collapse: collapse; }
          td { font-family: Arial, sans-serif; }
        </style>
        <![endif]-->
        <style>
          @media only screen and (max-width: 620px) {
            .mobile-full-width { width: 100% !important; max-width: 100% !important; }
            .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
            .mobile-center { text-align: center !important; }
            .mobile-font-small { font-size: 12px !important; }
          }
        </style>
      </head>
      <body style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 0; margin: 0; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 16px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background: #111111; border-radius: 12px; overflow: hidden; border: 1px solid #1a1a1a;" class="mobile-full-width">
          
                <!-- Header -->
                <tr>
                  <td style="background: #0d1117; padding: 32px 20px; text-align: center; border-bottom: 2px solid #00ff88;" class="mobile-padding">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 16px;">
                          <img src="${logoUrl}" alt="IoT & Robotics Club" width="80" height="80" style="display: block; border-radius: 50%;" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">IoT & Robotics Club</h1>
                          <p style="color: #00d4ff; font-size: 11px; margin: 8px 0 0 0; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Bennett University</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Success Banner -->
                <tr>
                  <td style="background: rgba(0,255,136,0.1); padding: 14px 16px; text-align: center; border-bottom: 1px solid #222;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="background: #00ff88; color: #000000; padding: 10px 20px; border-radius: 20px; font-weight: 700; font-size: 12px; letter-spacing: 1px;">
                          ✓ REGISTRATION CONFIRMED
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 28px 20px;" class="mobile-padding">
            <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 6px 0; font-weight: 600;">You're In, ${teamName}!</h2>
            <p style="color: #666666; font-size: 13px; margin: 0 0 24px 0;">Your team has been registered for REWIRE 2026</p>
            
            <!-- Event Details Card -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
              <tr>
                <td style="background: #1e1e1e; padding: 12px 16px; border-bottom: 1px solid #2a2a2a;">
                  <span style="color: #00ff88; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Event Details</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 0;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 12px 16px; color: #777777; font-size: 13px;">Track</td>
                      <td style="padding: 12px 16px; text-align: right;">
                        <span style="background: #bd00ff33; color: #d580ff; padding: 5px 12px; border-radius: 5px; font-weight: 600; font-size: 12px; border: 1px solid #bd00ff44;">${track}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; color: #777777; font-size: 13px; border-top: 1px solid #252525;">Date</td>
                      <td style="padding: 12px 16px; color: #ffffff; font-weight: 600; text-align: right; font-size: 13px; border-top: 1px solid #252525;">February 3, 2026</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; color: #777777; font-size: 13px; border-top: 1px solid #252525;">Time</td>
                      <td style="padding: 12px 16px; color: #ffffff; font-weight: 600; text-align: right; font-size: 13px; border-top: 1px solid #252525;">6:30 PM onwards</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; color: #777777; font-size: 13px; border-top: 1px solid #252525;">Venue</td>
                      <td style="padding: 12px 16px; color: #ffffff; font-weight: 600; text-align: right; font-size: 13px; border-top: 1px solid #252525;">LH 103, Block P</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Team Members -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
              <tr>
                <td style="background: #1e1e1e; padding: 12px 16px; border-bottom: 1px solid #2a2a2a;">
                  <span style="color: #00d4ff; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Team Roster</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 0;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    ${memberList}
                  </table>
                </td>
              </tr>
            </table>

            ${ticketSection}

            <!-- Important Info -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
              <tr>
                <td style="background: rgba(255,165,0,0.08); border-left: 3px solid #ffa500; padding: 16px; border-radius: 0 10px 10px 0;">
                  <h3 style="color: #ffb84d; font-size: 13px; margin: 0 0 10px 0; font-weight: 600;">Important Reminders</h3>
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 4px 0; color: #999999; font-size: 12px;">• Bring your college ID card</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #999999; font-size: 12px;">• Arrive 15 minutes early</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #999999; font-size: 12px;">• Have the QR code ready at check-in</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #0a0a0a; padding: 20px 16px; text-align: center; border-top: 1px solid #1a1a1a;">
                    <p style="color: #00d4ff; font-size: 12px; margin: 0 0 8px 0;">
                      📷 <a href="https://www.instagram.com/iot_and_robotics_bu/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">Instagram</a> &nbsp;•&nbsp; 💼 <a href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">LinkedIn</a>
                    </p>
                    <p style="color: #555555; font-size: 11px; margin: 0 0 4px 0; font-weight: 500;">
                      IoT & Robotics Club
                    </p>
                    <p style="color: #333333; font-size: 10px; margin: 0;">
                      Bennett University • © ${new Date().getFullYear()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
export const generateRecruitmentConfirmation = (name: string, team: string, role: string) => {
  const logoUrl = 'https://iotbu.vercel.app/logo-iot.png';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="x-apple-disable-message-reformatting"/>
        <meta name="format-detection" content="telephone=no, address=no, email=no, date=no, url=no"/>
        <title>Application Received - IoT &amp; Robotics Club</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          @media only screen and (max-width: 620px) {
            .mobile-full-width { width: 100% !important; max-width: 100% !important; }
            .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
          }
        </style>
      </head>
      <body style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 0; margin: 0; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 16px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background: #111111; border-radius: 12px; overflow: hidden; border: 1px solid #1a1a1a;" class="mobile-full-width">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: #0d1117; padding: 32px 20px; text-align: center; border-bottom: 2px solid #00d4ff;" class="mobile-padding">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 16px;">
                          <img src="${logoUrl}" alt="IoT" width="70" height="70" style="display: block; border-radius: 50%;" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">IoT &amp; Robotics Club</h1>
                          <p style="color: #00d4ff; font-size: 11px; margin: 8px 0 0 0; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">BENNETT UNIVERSITY</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Success Banner -->
                <tr>
                  <td style="background: rgba(0,212,255,0.1); padding: 14px 16px; text-align: center;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="background: #00d4ff; color: #000000; padding: 10px 20px; border-radius: 20px; font-weight: 700; font-size: 12px; letter-spacing: 1px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                          ✓ APPLICATION RECEIVED
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 28px 20px;" class="mobile-padding">
                    <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 6px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Hey ${name}!</h2>
                    <p style="color: #666666; font-size: 13px; margin: 0 0 20px 0;">Thanks for your interest in joining our community</p>
                    
                    <p style="color: #b0b0b0; font-size: 14px; margin: 0 0 24px 0; line-height: 1.7;">
                      We've received your application to join the <span style="color: #00d4ff; font-weight: 600;">IoT &amp; Robotics Club</span>. Our team is excited to review your profile and learn more about what you can bring to our community.
                    </p>
                    
                    <!-- Application Details Card -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; overflow: hidden; margin-bottom: 24px;">
                      <tr>
                        <td style="background: #1e1e1e; padding: 12px 16px; border-bottom: 1px solid #2a2a2a;">
                          <span style="color: #00d4ff; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Application Details</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 14px 16px; color: #777777; font-size: 13px; width: 40%;">Team</td>
                              <td style="padding: 14px 16px; text-align: right;">
                                <span style="background: #bd00ff33; color: #d580ff; padding: 5px 12px; border-radius: 5px; font-weight: 600; font-size: 12px;">${team}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 14px 16px; color: #777777; font-size: 13px; border-top: 1px solid #252525;">Role</td>
                              <td style="padding: 14px 16px; color: #ffffff; font-weight: 600; text-align: right; font-size: 13px; border-top: 1px solid #252525;">${role}</td>
                            </tr>
                            <tr>
                              <td style="padding: 14px 16px; color: #777777; font-size: 13px; border-top: 1px solid #252525;">Status</td>
                              <td style="padding: 14px 16px; text-align: right; border-top: 1px solid #252525;">
                                <span style="background: #ffa50033; color: #ffb84d; padding: 5px 12px; border-radius: 5px; font-weight: 600; font-size: 12px;">Under Review</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- What's Next Section -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: rgba(0,212,255,0.06); border-left: 3px solid #00d4ff; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 18px 16px;">
                          <h3 style="color: #00d4ff; font-size: 14px; margin: 0 0 12px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">What Happens Next?</h3>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr><td style="padding: 5px 0; color: #999999; font-size: 13px;"><span style="color: #00d4ff; font-weight: 600;">1.</span> &nbsp;Our team will review your application</td></tr>
                            <tr><td style="padding: 5px 0; color: #999999; font-size: 13px;"><span style="color: #00d4ff; font-weight: 600;">2.</span> &nbsp;If shortlisted, you'll get an interview invite</td></tr>
                            <tr><td style="padding: 5px 0; color: #999999; font-size: 13px;"><span style="color: #00d4ff; font-weight: 600;">3.</span> &nbsp;Selected candidates join the club!</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #555555; font-size: 12px; text-align: center; margin: 0;">
                      Follow us on <a href="https://www.instagram.com/iot_and_robotics_bu/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">Instagram</a> &amp; <a href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">LinkedIn</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #0a0a0a; padding: 20px 16px; text-align: center; border-top: 1px solid #1a1a1a;">
                    <p style="color: #00d4ff; font-size: 12px; margin: 0 0 8px 0;">
                      📷 <a href="https://www.instagram.com/iot_and_robotics_bu/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">Instagram</a> &nbsp;•&nbsp; 💼 <a href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">LinkedIn</a>
                    </p>
                    <p style="color: #555555; font-size: 11px; margin: 0 0 4px 0; font-weight: 500;">IoT &amp; Robotics Club</p>
                    <p style="color: #333333; font-size: 10px; margin: 0;">Bennett University • © ${new Date().getFullYear()}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
