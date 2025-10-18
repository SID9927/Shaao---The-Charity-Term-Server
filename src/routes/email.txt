import express from 'express';
import { sendMail } from '../utils/mailer.js';

export const router = express.Router();

router.post('/', async (req, res) => {
  const { toMail, subject, messageBody } = req.body;

  if (!toMail || !subject || !messageBody) {
    return res.status(400).json({ error: 'toMail, subject, and messageBody are required.' });
  }

  try {
    await sendMail({
      to: toMail,
      subject,
      text: messageBody,
    });

    res.json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});
