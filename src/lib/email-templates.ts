export const generateAdminNotification = (title: string, data: Record<string, string>) => {
  const logoUrl = 'https://iotbu.vercel.app/logo-iot.png';
  
  const rows = Object.entries(data).map(([key, value]) => `
    <tr>
      <td style="padding: 14px 16px; color: #888888; font-size: 13px; text-transform: capitalize; border-bottom: 1px solid #2a2a2a;">${key.replace(/([A-Z])/g, ' $1').trim()}</td>
      <td style="padding: 14px 16px; color: #ffffff; font-weight: 500; text-align: right; border-bottom: 1px solid #2a2a2a;">${value}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Admin Notification - IoT &amp; Robotics Club</title>
      </head>
      <body style="background-color: #0a0a0a; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 0; margin: 0; line-height: 1.6;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; margin-top: 20px; margin-bottom: 20px;">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #111111; border-radius: 12px; overflow: hidden; border: 1px solid #222222;">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); padding: 35px 30px; text-align: center; border-bottom: 2px solid #00d4ff;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 15px;">
                          <img src="${logoUrl}" alt="IoT" width="70" height="70" style="display: block; border-radius: 50%;" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 1px;">IoT &amp; Robotics Club</h1>
                          <p style="color: #00d4ff; font-size: 12px; margin: 5px 0 0 0; font-weight: 500; letter-spacing: 2px;">ADMIN NOTIFICATION</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Notification Type -->
                <tr>
                  <td style="background: rgba(0,212,255,0.1); padding: 15px 25px; border-bottom: 1px solid #333;">
                    <span style="color: #00d4ff; font-weight: 600; font-size: 16px;">📬 ${title}</span>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 25px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #1a1a1a; border: 1px solid #333; border-radius: 10px; overflow: hidden;">
                      ${rows}
                    </table>
                    
                    <p style="color: #666666; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
                      Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222;">
                    <p style="color: #00d4ff; font-size: 12px; margin: 0 0 8px 0;">
                      📷 <a href="https://www.instagram.com/iot_and_robotics_bu/" style="color: #00d4ff; text-decoration: none;">Instagram</a> &nbsp;•&nbsp; 💼 <a href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" style="color: #00d4ff; text-decoration: none;">LinkedIn</a>
                    </p>
                    <p style="color: #444444; font-size: 11px; margin: 0;">
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
      <td style="padding: 16px; text-align: center; width: 60px;">
        <div style="width: 36px; height: 36px; background: ${i === 0 ? 'linear-gradient(135deg, #bd00ff 0%, #00d4ff 100%)' : '#2a2a2a'}; border-radius: 50%; line-height: 36px; text-align: center; color: #fff; font-weight: 700; font-size: 14px; margin: 0 auto;">${i + 1}</div>
      </td>
      <td style="padding: 16px 10px;">
        <div style="color: #ffffff; font-weight: 600; font-size: 14px; margin-bottom: 2px;">${m.name}</div>
        <div style="color: #666666; font-size: 12px;">${m.email}</div>
      </td>
      <td style="padding: 16px; text-align: right;">
        <span style="background: ${i === 0 ? 'linear-gradient(135deg, #bd00ff22 0%, #bd00ff33 100%)' : '#1a1a1a'}; color: ${i === 0 ? '#d580ff' : '#666'}; padding: 5px 12px; border-radius: 5px; font-size: 10px; font-weight: 700; letter-spacing: 1px; border: 1px solid ${i === 0 ? '#bd00ff44' : '#2a2a2a'};">${i === 0 ? 'LEAD' : 'MEMBER'}</span>
      </td>
    </tr>
  `).join('');

  // Generate QR code image URL using QR Server API (free, no authentication)
  const qrImageUrl = ticketUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketUrl)}&bgcolor=ffffff&color=000000`
    : '';

  const ticketSection = ticketUrl ? `
    <div style="margin-top: 32px; padding: 32px; background: linear-gradient(135deg, rgba(189,0,255,0.08) 0%, rgba(0,212,255,0.08) 100%); border: 1px solid #2a2a2a; border-radius: 16px; text-align: center;">
      <div style="color: #bd00ff; font-size: 11px; margin-bottom: 6px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Event Pass</div>
      <div style="color: #ffffff; font-size: 15px; margin-bottom: 24px; font-weight: 500;">Present this QR code at check-in</div>
      <div style="background: #ffffff; display: inline-block; padding: 16px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,212,255,0.2);">
        <img src="${qrImageUrl}" alt="Ticket QR Code" width="160" height="160" style="display: block;" />
      </div>
      <div style="color: #555555; font-size: 12px; margin-top: 16px;">Scan at venue entrance</div>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
      </head>
      <body style="background-color: #000000; color: #ffffff; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; padding: 20px; margin: 0; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #0d0d0d 0%, #111111 100%); border-radius: 16px; overflow: hidden; border: 1px solid #1a1a1a; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #1a1a2e 100%); padding: 50px 30px; text-align: center; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #00ff88 0%, #00d4ff 50%, #00ff88 100%);"></div>
            <div style="margin-bottom: 20px;">
              <img src="${logoUrl}" alt="IoT & Robotics Club" width="100" height="100" style="display: block; margin: 0 auto; border-radius: 50%; box-shadow: 0 0 40px rgba(0,255,136,0.3);" />
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">IoT & Robotics Club</h1>
            <p style="color: #00d4ff; font-size: 13px; margin-top: 8px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Bennett University</p>
          </div>

          <!-- Success Banner -->
          <div style="background: linear-gradient(90deg, rgba(0,255,136,0.15) 0%, rgba(0,212,255,0.15) 100%); padding: 18px 30px; text-align: center; border-top: 1px solid #222; border-bottom: 1px solid #222;">
            <table cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td style="background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%); color: #000000; padding: 10px 28px; border-radius: 25px; font-weight: 700; font-size: 13px; letter-spacing: 1.5px;">
                  ✓ REGISTRATION CONFIRMED
                </td>
              </tr>
            </table>
          </div>

          <!-- Content -->
          <div style="padding: 45px 35px;">
            <h2 style="color: #ffffff; font-size: 24px; margin-top: 0; margin-bottom: 8px; font-weight: 600;">You're In, ${teamName}!</h2>
            <p style="color: #666666; font-size: 14px; margin-top: 0; margin-bottom: 32px;">Your team has been registered for REWIRE 2026</p>
            
            <!-- Event Details Card -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%); border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
              <div style="background: #1e1e1e; padding: 16px 22px; border-bottom: 1px solid #2a2a2a;">
                <span style="color: #00ff88; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Event Details</span>
              </div>
              <div style="padding: 5px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 14px 22px; color: #777777; font-size: 14px;">Track</td>
                    <td style="padding: 14px 22px; text-align: right;">
                      <span style="background: linear-gradient(135deg, #bd00ff22 0%, #bd00ff33 100%); color: #d580ff; padding: 6px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; border: 1px solid #bd00ff44;">${track}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 22px; color: #777777; font-size: 14px; border-top: 1px solid #252525;">Date</td>
                    <td style="padding: 14px 22px; color: #ffffff; font-weight: 600; text-align: right; font-size: 14px; border-top: 1px solid #252525;">February 3, 2026</td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 22px; color: #777777; font-size: 14px; border-top: 1px solid #252525;">Time</td>
                    <td style="padding: 14px 22px; color: #ffffff; font-weight: 600; text-align: right; font-size: 14px; border-top: 1px solid #252525;">6:30 PM onwards</td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 22px; color: #777777; font-size: 14px; border-top: 1px solid #252525;">Venue</td>
                    <td style="padding: 14px 22px; color: #ffffff; font-weight: 600; text-align: right; font-size: 14px; border-top: 1px solid #252525;">Lab 105, Block B</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Team Members -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%); border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
              <div style="background: #1e1e1e; padding: 16px 22px; border-bottom: 1px solid #2a2a2a;">
                <span style="color: #00d4ff; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Team Roster</span>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                ${memberList}
              </table>
            </div>

            ${ticketSection}

            <!-- Important Info -->
            <div style="background: linear-gradient(135deg, rgba(255,165,0,0.08) 0%, rgba(255,165,0,0.03) 100%); border-left: 3px solid #ffa500; padding: 20px 24px; border-radius: 0 12px 12px 0; margin-top: 28px;">
              <h3 style="color: #ffb84d; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">Important Reminders</h3>
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                  <td style="padding: 6px 0; color: #999999; font-size: 13px;">• Bring your college ID card</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #999999; font-size: 13px;">• Arrive 15 minutes early</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #999999; font-size: 13px;">• Have the QR code ready at check-in</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #0a0a0a; padding: 28px 30px; text-align: center; border-top: 1px solid #1a1a1a;">
            <p style="color: #00d4ff; font-size: 13px; margin: 0 0 10px 0;">
              📷 <a href="https://www.instagram.com/iot_and_robotics_bu/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">Instagram</a> &nbsp;•&nbsp; 💼 <a href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">LinkedIn</a>
            </p>
            <p style="color: #555555; font-size: 12px; margin: 0 0 6px 0; font-weight: 500;">
              IoT & Robotics Club
            </p>
            <p style="color: #333333; font-size: 11px; margin: 0;">
              Bennett University • © ${new Date().getFullYear()}
            </p>
          </div>
        </div>
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
        <title>Application Received - IoT &amp; Robotics Club</title>
      </head>
      <body style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 20px; margin: 0; line-height: 1.6;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #111111; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a1a;">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #1a1a2e 100%); padding: 45px 30px; text-align: center; border-bottom: 3px solid #00d4ff;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 20px;">
                          <img src="${logoUrl}" alt="IoT" width="90" height="90" style="display: block; border-radius: 50%;" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">IoT &amp; Robotics Club</h1>
                          <p style="color: #00d4ff; font-size: 12px; margin: 10px 0 0 0; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">BENNETT UNIVERSITY</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Success Banner -->
                <tr>
                  <td style="background: linear-gradient(90deg, rgba(0,212,255,0.12) 0%, rgba(189,0,255,0.12) 100%); padding: 20px 30px; text-align: center;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="background: #00d4ff; color: #000000; padding: 12px 30px; border-radius: 25px; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                          ✓ APPLICATION RECEIVED
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 35px;">
                    <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 8px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Hey ${name}!</h2>
                    <p style="color: #666666; font-size: 14px; margin: 0 0 25px 0;">Thanks for your interest in joining our community</p>
                    
                    <p style="color: #b0b0b0; font-size: 15px; margin: 0 0 30px 0; line-height: 1.7;">
                      We've received your application to join the <span style="color: #00d4ff; font-weight: 600;">IoT &amp; Robotics Club</span>. Our team is excited to review your profile and learn more about what you can bring to our community.
                    </p>
                    
                    <!-- Application Details Card -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; margin-bottom: 30px;">
                      <tr>
                        <td style="background: #1e1e1e; padding: 14px 20px; border-bottom: 1px solid #2a2a2a;">
                          <span style="color: #00d4ff; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Application Details</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 16px 20px; color: #777777; font-size: 14px; width: 40%;">Team</td>
                              <td style="padding: 16px 20px; text-align: right;">
                                <span style="background: #bd00ff33; color: #d580ff; padding: 6px 14px; border-radius: 6px; font-weight: 600; font-size: 13px;">${team}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 16px 20px; color: #777777; font-size: 14px; border-top: 1px solid #252525;">Role</td>
                              <td style="padding: 16px 20px; color: #ffffff; font-weight: 600; text-align: right; font-size: 14px; border-top: 1px solid #252525;">${role}</td>
                            </tr>
                            <tr>
                              <td style="padding: 16px 20px; color: #777777; font-size: 14px; border-top: 1px solid #252525;">Status</td>
                              <td style="padding: 16px 20px; text-align: right; border-top: 1px solid #252525;">
                                <span style="background: #ffa50033; color: #ffb84d; padding: 6px 14px; border-radius: 6px; font-weight: 600; font-size: 13px;">Under Review</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- What's Next Section -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: rgba(0,212,255,0.06); border-left: 3px solid #00d4ff; border-radius: 0 10px 10px 0; margin-bottom: 25px;">
                      <tr>
                        <td style="padding: 22px;">
                          <h3 style="color: #00d4ff; font-size: 15px; margin: 0 0 14px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">What Happens Next?</h3>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr><td style="padding: 6px 0; color: #999999; font-size: 14px;"><span style="color: #00d4ff; font-weight: 600;">1.</span> &nbsp;Our team will review your application</td></tr>
                            <tr><td style="padding: 6px 0; color: #999999; font-size: 14px;"><span style="color: #00d4ff; font-weight: 600;">2.</span> &nbsp;If shortlisted, you'll get an interview invite</td></tr>
                            <tr><td style="padding: 6px 0; color: #999999; font-size: 14px;"><span style="color: #00d4ff; font-weight: 600;">3.</span> &nbsp;Selected candidates join the club!</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #555555; font-size: 13px; text-align: center; margin: 0;">
                      Follow us on <a href="https://www.instagram.com/iot_and_robotics_bu/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">Instagram</a> &amp; <a href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">LinkedIn</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #0a0a0a; padding: 25px 30px; text-align: center; border-top: 1px solid #1a1a1a;">
                    <p style="color: #00d4ff; font-size: 13px; margin: 0 0 10px 0;">
                      📷 <a href="https://www.instagram.com/iot_and_robotics_bu/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">Instagram</a> &nbsp;•&nbsp; 💼 <a href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" style="color: #00d4ff; text-decoration: none; font-weight: 600;">LinkedIn</a>
                    </p>
                    <p style="color: #555555; font-size: 12px; margin: 0 0 5px 0; font-weight: 500;">IoT &amp; Robotics Club</p>
                    <p style="color: #333333; font-size: 11px; margin: 0;">Bennett University • © ${new Date().getFullYear()}</p>
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
