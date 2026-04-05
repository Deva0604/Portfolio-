const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMessage(value) {
  return escapeHtml(value).replace(/\n/g, '<br>');
}

function normalizeHeaderValue(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim();
}

function buildInboxEmail({ name, email, subject, message }) {
  const cleanName = normalizeHeaderValue(name);
  const cleanSubject = normalizeHeaderValue(subject);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = formatMessage(message);

  return {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: `Portfolio Inquiry | ${cleanSubject}`,
    replyTo: email,
    text: [
      'New message from the portfolio contact form',
      '',
      `Name: ${cleanName}`,
      `Email: ${email}`,
      `Subject: ${cleanSubject}`,
      '',
      'Message:',
      message,
      '',
      'Reply directly to this message to respond to the visitor.',
    ].join('\n'),
    html: `
      <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#102033;">
        <div style="max-width:680px;margin:0 auto;padding:32px 18px;">
          <div style="background:linear-gradient(135deg,#0f172a,#0b1220);border-radius:18px 18px 0 0;padding:26px 28px;color:#ffffff;">
            <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#7dd3fc;">Portfolio Contact Form</p>
            <h2 style="margin:0;font-size:24px;line-height:1.2;">New inquiry from ${safeName}</h2>
            <p style="margin:10px 0 0 0;color:#cbd5e1;font-size:14px;line-height:1.6;">Someone reached out through your portfolio and left the message below.</p>
          </div>
          <div style="background:#ffffff;border:1px solid #dbe4f0;border-top:none;border-radius:0 0 18px 18px;padding:28px;box-shadow:0 14px 40px rgba(15,23,42,0.08);">
            <div style="display:grid;gap:12px;margin-bottom:22px;">
              <div style="padding:14px 16px;background:#f8fbff;border:1px solid #e2e8f0;border-radius:12px;"><strong style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#0f766e;margin-bottom:6px;">Name</strong><span style="font-size:14px;color:#102033;">${safeName}</span></div>
              <div style="padding:14px 16px;background:#f8fbff;border:1px solid #e2e8f0;border-radius:12px;"><strong style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#0f766e;margin-bottom:6px;">Email</strong><span style="font-size:14px;color:#102033;"><a href="mailto:${safeEmail}" style="color:#0284c7;text-decoration:none;">${safeEmail}</a></span></div>
              <div style="padding:14px 16px;background:#f8fbff;border:1px solid #e2e8f0;border-radius:12px;"><strong style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#0f766e;margin-bottom:6px;">Subject</strong><span style="font-size:14px;color:#102033;">${safeSubject}</span></div>
            </div>
            <div style="padding:18px 18px 16px;border-left:4px solid #06b6d4;background:#f8fbff;border-radius:12px;">
              <strong style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#0f766e;margin-bottom:10px;">Message</strong>
              <div style="font-size:14px;line-height:1.8;color:#102033;white-space:normal;">${safeMessage}</div>
            </div>
            <div style="margin-top:22px;padding-top:18px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.7;color:#64748b;">
              <p style="margin:0;">Reply directly to this email to continue the conversation. The visitor's address has been set as the reply-to address.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  };
}

function buildConfirmationEmail({ name, email, subject, message }) {
  const cleanName = normalizeHeaderValue(name);
  const cleanSubject = normalizeHeaderValue(subject);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = formatMessage(message);

  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Thanks for reaching out, ${cleanName}`,
    text: [
      `Hi ${cleanName},`,
      '',
      'Thanks for reaching out through my portfolio. I have received your message and will get back to you as soon as possible.',
      '',
      'Your message summary:',
      `Subject: ${cleanSubject}`,
      `Email: ${email}`,
      '',
      'Message:',
      message,
      '',
      'Best regards,',
      'Devapriyan R',
      'AI & ML Engineer | Web Developer',
    ].join('\n'),
    html: `
      <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#102033;">
        <div style="max-width:680px;margin:0 auto;padding:32px 18px;">
          <div style="background:linear-gradient(135deg,#0f172a,#1d4ed8);border-radius:18px 18px 0 0;padding:26px 28px;color:#ffffff;">
            <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#93c5fd;">Message Received</p>
            <h2 style="margin:0;font-size:24px;line-height:1.2;">Thanks, ${safeName}</h2>
            <p style="margin:10px 0 0 0;color:#dbeafe;font-size:14px;line-height:1.6;">Your message has been received. I’ll review it and reply as soon as possible.</p>
          </div>
          <div style="background:#ffffff;border:1px solid #dbe4f0;border-top:none;border-radius:0 0 18px 18px;padding:28px;box-shadow:0 14px 40px rgba(15,23,42,0.08);">
            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.8;color:#102033;">Hi ${safeName},</p>
            <p style="margin:0 0 22px 0;font-size:14px;line-height:1.8;color:#334155;">I’ve received your message and I appreciate you reaching out. I’ll take a look and get back to you shortly.</p>
            <div style="padding:18px;border:1px solid #dbe4f0;background:#f8fbff;border-radius:12px;">
              <strong style="display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#1d4ed8;margin-bottom:10px;">Your Message</strong>
              <p style="margin:0 0 10px 0;font-size:13px;line-height:1.7;color:#102033;"><strong>Subject:</strong> ${safeSubject}</p>
              <p style="margin:0 0 10px 0;font-size:13px;line-height:1.7;color:#102033;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#0284c7;text-decoration:none;">${safeEmail}</a></p>
              <div style="margin-top:14px;padding:14px 16px;background:#ffffff;border-left:4px solid #1d4ed8;border-radius:10px;font-size:14px;line-height:1.8;color:#102033;">${safeMessage}</div>
            </div>
            <div style="margin-top:22px;padding-top:18px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:14px;line-height:1.8;color:#102033;">Best regards,<br><strong>Devapriyan R</strong><br>AI & ML Engineer | Web Developer</p>
              <p style="margin:12px 0 0 0;font-size:12px;line-height:1.7;color:#64748b;">This is an automated confirmation. If your message is urgent, feel free to send a follow-up.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  };
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'devapriyan_portfolio.html'));
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all fields.' 
      });
    }

    // Email regex
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address.' 
      });
    }

    // Compose email to you (site owner)
    const mailOptions = buildInboxEmail({ name, email, subject, message });

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to visitor
    const confirmationEmail = buildConfirmationEmail({ name, email, subject, message });

    await transporter.sendMail(confirmationEmail);

    res.json({ 
      success: true, 
      message: '✅ Message sent successfully! I\'ll get back to you soon.' 
    });

  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_SERVICE}`);
  console.log(`📬 Recipient email: ${process.env.RECIPIENT_EMAIL}`);
});
