import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Verify that key exists
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found in environment variables');
}

export async function sendMail({ to, subject, text, html }) {
  try {
    const data = await resend.emails.send({
      from: 'Shaao <onboarding@resend.dev>', // default sender
      to,
      subject,
      html: html || `<p>${text}</p>`,
    });

    console.log('✅ Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Resend Email Error:', error);
    throw error;
  }
}
