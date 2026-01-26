export const generateAdminNotification = (title: string, data: Record<string, string>) => {
  const rows = Object.entries(data).map(([key, value]) => `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px; color: #888; font-family: monospace; text-transform: uppercase;">${key.replace(/([A-Z])/g, ' $1')}</td>
      <td style="padding: 12px; color: #fff; font-family: sans-serif; font-weight: bold;">${value}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #000; color: #fff; font-family: sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
          <div style="background: #111; padding: 20px; text-align: center; border-bottom: 1px solid #00d4ff;">
            <h1 style="color: #fff; margin: 0; font-family: 'Courier New', monospace; letter-spacing: 2px;">INCOMING TRANSMISSION</h1>
          </div>
          <div style="padding: 24px; background: #050505;">
            <h2 style="color: #00d4ff; margin-top: 0;">${title}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${rows}
            </table>
          </div>
          <div style="background: #111; padding: 12px; text-align: center; color: #666; font-size: 12px; font-family: monospace;">
            SECURE CHANNEL // ENCRYPTED
          </div>
        </div>
      </body>
    </html>
  `;
};

export const generateTeamConfirmation = (teamName: string, track: string, members: any[], ticketUrl?: string) => {
  const memberList = members.map((m, i) => `
    <div style="background: #111; padding: 10px; margin-bottom: 8px; border-left: 3px solid ${i === 0 ? '#bd00ff' : '#333'};">
      <div style="color: #888; font-size: 10px; font-family: monospace;">AGENT 0${i + 1}</div>
      <div style="color: #fff; font-weight: bold;">${m.name}</div>
      <div style="color: #666; font-size: 12px;">${m.email}</div>
    </div>
  `).join('');

  // Generate QR code image URL using QR Server API (free, no authentication)
  const qrImageUrl = ticketUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketUrl)}`
    : '';

  const ticketSection = ticketUrl ? `
    <div style="margin-top: 30px; padding: 20px; background: #bd00ff15; border: 1px solid #bd00ff55; border-radius: 6px; text-align: center;">
      <div style="color: #bd00ff; font-size: 14px; margin-bottom: 8px; font-family: monospace;">YOUR EVENT TICKET</div>
      <div style="color: #fff; font-size: 14px; margin-bottom: 16px;">Show this QR code at check-in</div>
      <div style="background: #fff; display: inline-block; padding: 10px; border-radius: 8px;">
        <img src="${qrImageUrl}" alt="Ticket QR Code" width="200" height="200" style="display: block;" />
      </div>
      <div style="color: #888; font-size: 12px; margin-top: 12px;">Scan with the staff scanner at the venue</div>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #000; color: #fff; font-family: sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
          <div style="background: #000; padding: 30px; text-align: center; border-bottom: 2px solid #00ff88;">
             <h1 style="color: #00ff88; margin: 0; font-family: 'Courier New', monospace; letter-spacing: 2px;">MISSION ACCEPTED</h1>
          </div>
          <div style="padding: 30px; background: #080808;">
            <p style="color: #ccc; line-height: 1.6;">
              Greetings Team Lead. Your squad <strong>${teamName}</strong> has been officially enlisted for the Rewire 2026 operation.
            </p>
            
            <div style="margin: 24px 0;">
              <div style="color: #bd00ff; font-family: monospace; font-size: 12px; margin-bottom: 4px;">MISSION TRACK</div>
              <div style="font-size: 24px; font-weight: bold; color: #fff;">${track}</div>
            </div>

            <h3 style="color: #fff; border-bottom: 1px solid #333; padding-bottom: 8px; margin-top: 24px;">SQUAD ROSTER</h3>
            ${memberList}

            ${ticketSection}

            <div style="margin-top: 30px; padding: 20px; background: #00ff8808; border: 1px solid #00ff8833; border-radius: 6px; text-align: center;">
              <div style="color: #00ff88; font-size: 14px; margin-bottom: 8px; font-family: monospace;">MISSION COMMENCEMENT</div>
              <div style="color: #fff; font-size: 20px; font-weight: bold;">FEB 04, 2026 @ 09:00 HRS</div>
              <div style="color: #666; font-size: 12px; margin-top: 5px;">SECTOR B (LAB 105)</div>
            </div>
          </div>
          <div style="background: #111; padding: 20px; text-align: center; color: #444; font-size: 12px; font-family: monospace;">
            IoT & ROBOTICS CLUB HQ<br/>
            AUTOMATED DISPATCH SYSTEM
          </div>
        </div>
      </body>
    </html>
  `;
};
export const generateRecruitmentConfirmation = (name: string, team: string, role: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="background-color: #f4f4f4; color: #333333; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; padding: 0; margin: 0; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-top: 20px; margin-bottom: 20px;">
          
          <!-- Header -->
          <div style="background: #111111; padding: 40px 30px; text-align: center;">
             <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">IoT & Robotics Club</h1>
             <p style="color: #888888; font-size: 14px; margin-top: 8px; font-weight: 400;">Bennett University</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #111111; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Application Received</h2>
            
            <p style="color: #555555; font-size: 16px; margin-bottom: 24px;">
              Dear <strong>${name}</strong>,
            </p>
            
            <p style="color: #555555; font-size: 16px; margin-bottom: 30px;">
              Thank you for your interest in joining the IoT & Robotics Club. We have successfully received your application. Our team is excited to review your profile.
            </p>
            
            <!-- Application Details -->
            <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #333333; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0; letter-spacing: 1px; font-weight: 600;">Application Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666666; font-size: 14px;">Team Selection:</td>
                  <td style="padding: 8px 0; color: #111111; font-weight: 600; text-align: right; font-size: 14px;">${team} Team</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 1px solid #eaeaea; color: #666666; font-size: 14px;">Role Applied:</td>
                  <td style="padding: 8px 0; border-top: 1px solid #eaeaea; color: #111111; font-weight: 600; text-align: right; font-size: 14px;">${role}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 1px solid #eaeaea; color: #666666; font-size: 14px;">Status:</td>
                  <td style="padding: 8px 0; border-top: 1px solid #eaeaea; color: #2ecc71; font-weight: 600; text-align: right; font-size: 14px;">Under Review</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #111111; font-size: 18px; margin-bottom: 12px;">Next Steps</h3>
            <p style="color: #555555; font-size: 15px; margin-bottom: 10px;">
              Our recruitment team is currently reviewing all applications. If your profile aligns with our requirements, you will receive an email invitation for the next round of interviews shortly.
            </p>
            <p style="color: #555555; font-size: 15px;">
              We appreciate your patience and look forward to potentially welcomimg you to the community.
            </p>
            
            <div style="margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px;">
              <p style="color: #555555; font-size: 15px; margin: 0;">
                Best Regards,<br/>
                <strong>The Recruitment Team</strong><br/>
                <span style="color: #888888; font-size: 14px;">IoT & Robotics Club</span>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} IoT & Robotics Club, Bennett University. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};
