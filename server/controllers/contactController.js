import { validationResult } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

// Small HTML escape to avoid injecting user-supplied HTML into the email body
const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Configure email transporter
const createTransporter = () => {
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const secure = smtpPort === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Optional timeouts to avoid hanging
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
  });
};

export const submitContactMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, message } = req.body;

    // Save to database
    const savedMessage = await ContactMessage.create({
      name,
      email,
      message,
      meta: {
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer || req.headers.referrer,
      },
    });

    // Send email notification (best-effort; don't fail the request if email fails)
    try {
      const transporter = createTransporter();

      // Optional: verify transporter connection early (useful for debugging)
      transporter.verify().catch((verifyErr) => {
        console.warn('SMTP verify failed (continuing):', verifyErr.message || verifyErr);
      });

      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br>');
      const safeMessageText = message || '';

      const fromAddress = process.env.SMTP_USER
        ? `"${escapeHtml(process.env.SITE_NAME || 'Website')}" <${process.env.SMTP_USER}>`
        : (process.env.CONTACT_EMAIL || 'no-reply@example.com');

      const toAddress = process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'no-reply@example.com';

      const mailOptions = {
        from: fromAddress,
        to: toAddress,
        subject: `New Contact Form Submission from ${safeName || 'Someone'}`,
        html: `
          <h2>New Contact Form Message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessageHtml}</p>
          <hr>
          <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
          <p><small>User Agent: ${escapeHtml(req.headers['user-agent'] || '')}</small></p>
        `,
        text: `
New Contact Form Message

Name: ${safeName}
Email: ${safeEmail}

Message:
${safeMessageText}

---
Submitted: ${new Date().toLocaleString()}
        `,
      };

      // only set replyTo if user provided an email
      if (email) {
        mailOptions.replyTo = email;
      }

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed (continuing, message saved):', emailError);
      // do not fail the user request if email sending fails
    }

    res.status(201).json({
      message: 'Message sent successfully',
      id: savedMessage._id,
      name: savedMessage.name,
      email: savedMessage.email,
      createdAt: savedMessage.createdAt,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      message: 'Failed to save message. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};