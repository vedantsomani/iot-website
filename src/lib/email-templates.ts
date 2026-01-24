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
      <body style="background-color: #050505; color: #e0e0e0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);">
          
          <!-- Header -->
          <div style="background: #000; padding: 30px; text-align: center; border-bottom: 2px solid #00d4ff; position: relative; overflow: hidden;">
             <div style="position: relative; z-index: 2;">
                 <h1 style="color: #fff; margin: 0; font-family: 'Courier New', monospace; letter-spacing: 3px; font-size: 24px;">APPLICATION <span style="color: #00d4ff;">RECEIVED</span></h1>
                 <div style="color: #666; font-size: 10px; font-family: monospace; margin-top: 8px;">TRANSMISSION ID: ${Date.now().toString().slice(-8)}</div>
             </div>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px; background: #0a0a0a;">
            <p style="color: #ccc; line-height: 1.6; font-size: 16px; margin-top: 0;">
              Greetings <strong>${name}</strong>,
            </p>
            <p style="color: #aaa; line-height: 1.6; font-size: 15px;">
              Your data packet has been successfully uploaded to the <strong>IoT & Robotics Club</strong> mainframe. Our recruitment protocols have initiated the review process.
            </p>
            
            <div style="background: #111; padding: 20px; border-left: 3px solid #00d4ff; margin: 30px 0; border-radius: 4px;">
              <div style="color: #00d4ff; font-size: 11px; font-family: monospace; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">// APPLICATION MANIFEST</div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #666; font-size: 14px; padding-bottom: 8px; width: 80px;">TARGET:</td>
                  <td style="color: #fff; font-weight: bold; font-size: 14px; padding-bottom: 8px;">${team.toUpperCase()} TEAM</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">ROLE:</td>
                  <td style="color: #fff; font-weight: bold; font-size: 14px;">${role.toUpperCase()}</td>
                </tr>
              </table>
            </div>

            <p style="color: #aaa; line-height: 1.6; font-size: 15px;">
              <strong>NEXT PHASE:</strong><br/>
              Our core unit is currently decrypting submissions. If your profile matches our operational requirements, you will receive an encrypted transmission (interview invite) shortly.
            </p>
            
            <p style="color: #666; font-size: 13px; margin-top: 40px; font-family: monospace; border-top: 1px solid #222; padding-top: 20px;">
              > STATUS: PENDING REVIEW<br/>
              > PRIORITY: NORMAL<br/>
              > END TRANSMISSION
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #000; padding: 15px; text-align: center; color: #444; font-size: 11px; font-family: monospace;">
            IoT & ROBOTICS CLUB // BENNETT UNIVERSITY<br/>
            AUTOMATED NOTIFICATION SYSTEM
          </div>
        </div>
      </body>
    </html>
  `;
};
