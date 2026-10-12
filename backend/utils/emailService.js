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
  const subtitle = isSignup
    ? 'Thank you for registering at New Ajeet Vision. Here is your verification code to complete your account setup:'
    : 'We received a request to reset your New Ajeet Vision account password. Here is your verification code:';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #E51926; margin: 0 0 12px 0; font-size: 22px;">New Ajeet Vision</h2>
      <p style="font-size: 14px; color: #374151; margin: 0 0 16px 0;">${subtitle}</p>
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 18px; text-align: center; margin: 0 0 20px 0;">
        <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #111827; font-family: monospace;">${otp}</span>
      </div>
      <p style="font-size: 13px; color: #6b7280; margin: 0 0 20px 0;">This code is valid for 10 minutes.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">New Ajeet Vision • Main Market, Obra, Bihar<br/>Helpline: +91 6203314651</p>
    </div>
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
  const subject = `Your New Ajeet Vision Verification Code is ${otp}`;

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
    text: `Hello,\n\nYour New Ajeet Vision verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nThank you,\nNew Ajeet Vision\nMain Market, Obra, Bihar\nHelpline: +91 6203314651`,
    html: generateOtpEmailHtml(otp, type),
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
