const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer Transporter
 * Works with Gmail or any custom SMTP provider.
 * When EMAIL_USER & EMAIL_PASS are set in .env, sends real emails.
 */
let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  // If host is explicitly specified (e.g. Hostinger SMTP / Custom SMTP)
  if (process.env.SMTP_HOST) {
    cachedTransporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: { user, pass },
    });
    return cachedTransporter;
  }

  // High-performance Gmail pooled transport
  cachedTransporter = nodemailer.createTransport({
    pool: true,
    service: 'gmail',
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
    auth: { user, pass },
  });

  return cachedTransporter;
};

/**
 * Generate branded HTML email template for OTP
 */
const generateOtpEmailHtml = (otp, type = 'signup') => {
  const isSignup = type === 'signup';
  const title = isSignup ? 'Verify Your Gmail Account' : 'Reset Your Password';
  const subtitle = isSignup
    ? 'Thank you for registering at New Ajeet Vision. Please verify your Gmail to complete your account setup.'
    : 'We received a request to reset your New Ajeet Vision account password.';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #F7F8FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7F8FA; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table width="100%" max-width="560px" style="max-width: 560px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #E5E7EB;">
            <!-- Brand Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #B91C1C 0%, #E51926 50%, #991B1B 100%); padding: 32px 24px; text-align: center;">
                <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 900; letter-spacing: 0.5px;">NEW AJEET VISION</h1>
                <p style="margin: 6px 0 0 0; color: #FEE2E2; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Obra, Bihar</p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 36px 32px;">
                <h2 style="margin: 0 0 12px 0; color: #111827; font-size: 20px; font-weight: 800;">${title}</h2>
                <p style="margin: 0 0 24px 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
                  ${subtitle}
                </p>

                <!-- OTP Display Box -->
                <div style="background-color: #FFF1F2; border: 2px dashed #E51926; border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
                  <span style="display: block; font-size: 12px; font-weight: 700; color: #991B1B; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Your One-Time Password (OTP)</span>
                  <span style="font-size: 38px; font-weight: 900; color: #B91C1C; letter-spacing: 8px; font-family: monospace;">${otp}</span>
                  <span style="display: block; font-size: 12px; font-weight: 600; color: #6B7280; margin-top: 10px;">⏰ Valid for 10 minutes only</span>
                </div>

                <p style="margin: 24px 0 0 0; color: #6B7280; font-size: 13px; line-height: 1.5;">
                  <strong>Important Security Note:</strong> Please do not share this OTP with anyone, including New Ajeet Vision staff. If you did not attempt to sign up, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #F9FAFB; padding: 24px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
                <p style="margin: 0; color: #374151; font-size: 12px; font-weight: 700;">New Ajeet Vision</p>
                <p style="margin: 4px 0 0 0; color: #6B7280; font-size: 11px;">Main Market, Main Road Obra, Aurangabad, Bihar - 824124</p>
                <p style="margin: 4px 0 0 0; color: #6B7280; font-size: 11px;">Helpline: +91 6203314651 | WhatsApp: +91 7488492130</p>
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

/**
 * Send OTP via Email
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6 digit numeric code
 * @param {string} type - 'signup' | 'forgot_password'
 */
const sendOtpEmail = async (toEmail, otp, type = 'signup') => {
  const transporter = getTransporter();
  const subject = type === 'signup'
    ? `${otp} is your New Ajeet Vision verification code`
    : `${otp} is your New Ajeet Vision password reset code`;

  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`[EMAIL OTP SIMULATION]`);
    console.log(`To: ${toEmail}`);
    console.log(`Type: ${type}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`(Configure EMAIL_USER and EMAIL_PASS in backend/.env to send real emails)`);
    console.log(`======================================================\n`);
    return {
      success: true,
      simulated: true,
      message: `OTP sent to ${toEmail} (Simulation mode active - check server console or preview code: ${otp})`,
      previewOtp: otp,
    };
  }

  const senderEmail = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const mailOptions = {
    from: `"New Ajeet Vision" <${senderEmail}>`,
    to: toEmail,
    subject,
    text: `Your New Ajeet Vision verification code is: ${otp}\n\nThis OTP is valid for 10 minutes. Please do not share it with anyone.\n\nNew Ajeet Vision\nMain Market, Main Road Obra, Aurangabad, Bihar\nHelpline: +91 6203314651`,
    html: generateOtpEmailHtml(otp, type),
    priority: 'high',
    headers: {
      'X-Priority': '1 (Highest)',
      'X-MSMail-Priority': 'High',
      'Importance': 'High',
    },
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EMAIL OTP SENT] MessageId: ${info.messageId} to ${toEmail}`);
  return {
    success: true,
    simulated: false,
    messageId: info.messageId,
  };
};

const prewarmEmailTransporter = () => {
  const transporter = getTransporter();
  if (transporter) {
    transporter.verify((err) => {
      if (err) {
        console.warn('[EMAIL SERVICE] SMTP verify warning:', err.message);
      } else {
        console.log('[EMAIL SERVICE] SMTP Pooled Connection Ready & Verified (Instant Delivery)');
      }
    });
  }
};

module.exports = {
  sendOtpEmail,
  prewarmEmailTransporter,
};
