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
      <body style="background-color: #f4f4f4; color: #333; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: #000; padding: 30px 40px; text-align: left; border-bottom: 4px solid #00d4ff;">
             <div style="color: #fff; font-size: 24px; font-weight: bold; font-family: 'Orbitron', sans-serif, monospace;">IoT & <span style="color: #00d4ff;">ROBOTICS</span> CLUB</div>
             <div style="color: #888; font-size: 14px; margin-top: 5px;">BENNETT UNIVERSITY</div>
          </div>

          <!-- Body -->
          <div style="padding: 40px;">
            <h2 style="color: #111; margin-top: 0; font-size: 20px;">Application Received</h2>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Dear <strong>${name}</strong>,
            </p>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for expressing your interest in joining the <strong>IoT & Robotics Club</strong>. We are pleased to confirm that your application has been successfully submitted and is currently under review by our recruitment committee.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #00d4ff; margin: 25px 0; border-radius: 4px;">
              <div style="color: #888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">Application Summary</div>
              <div style="margin-bottom: 8px;">
                <span style="color: #555; font-weight: 500; width: 60px; display: inline-block;">Team:</span> 
                <strong style="color: #000;">${team.charAt(0).toUpperCase() + team.slice(1)} Team</strong>
              </div>
              <div>
                <span style="color: #555; font-weight: 500; width: 60px; display: inline-block;">Role:</span> 
                <strong style="color: #000;">${role}</strong>
              </div>
            </div>

            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              <strong>What Happens Next?</strong><br/>
              Our leads will evaluate your profile and portfolio. If your skills and motivation align with our vision, you will be invited for an interview round. Please check your email regularly for updates.
            </p>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px; margin-top: 30px;">
              Best Regards,<br/>
              <strong>Recruitment Team</strong><br/>
              IoT & Robotics Club
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #111; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #222;">
            &copy; ${new Date().getFullYear()} IoT & Robotics Club, Bennett University.<br/>
            All Rights Reserved.
          </div>
        </div>
      </body>
    </html>
  `;
};
