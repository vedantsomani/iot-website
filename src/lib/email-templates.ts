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

export const generateTeamConfirmation = (teamName: string, track: string, members: any[]) => {
  const memberList = members.map((m, i) => `
    <div style="background: #111; padding: 10px; margin-bottom: 8px; border-left: 3px solid ${i === 0 ? '#bd00ff' : '#333'};">
      <div style="color: #888; font-size: 10px; font-family: monospace;">AGENT 0${i + 1}</div>
      <div style="color: #fff; font-weight: bold;">${m.name}</div>
      <div style="color: #666; font-size: 12px;">${m.email}</div>
    </div>
  `).join('');

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
