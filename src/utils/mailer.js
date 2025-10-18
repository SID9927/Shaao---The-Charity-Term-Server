import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((err, success) => {
  if (err) {
    console.error('Mailer Error:', err);
  } else {
    console.log('Mailer ready to send emails');
  }
});

export async function sendMail({ to, subject, text, html }) {
  const mailOptions = {
    from: `"Lottery App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html, // optional
  };

  return transporter.sendMail(mailOptions);
}