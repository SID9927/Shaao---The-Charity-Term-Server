import express from 'express';
import { Counter } from '../models/Counter.js';
import { Entry } from '../models/Entry.js';
import { validateEntryPayload, calculateAge } from '../utils/validators.js';

export const router = express.Router();

const COUNTER_NAME = 'ack_seq';

function formatAck(prefix, seq) {
  return `${prefix}-${String(seq).padStart(6, '0')}`;
}

// Peek next ack (for preview in modal; not reserved)
router.get('/next-ack', async (req, res) => {
  try {
    const prefix = process.env.ACK_PREFIX || 'ACK';
    const next = await Counter.peekNext(COUNTER_NAME);
    return res.json({ ackPreview: formatAck(prefix, next) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to get next ack' });
  }
});

// Create entry and atomically assign ack
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const age = calculateAge(payload.dob);
    const fullPayload = { ...payload, age };
    // const errors = validateEntryPayload(fullPayload);
    // if (errors.length) {
    //   return res.status(400).json({ errors });
    // }

    const prefix = process.env.ACK_PREFIX || 'ACK';
    const seq = await Counter.getNext(COUNTER_NAME);
    const ackId = formatAck(prefix, seq);

    const entry = await Entry.create({
      ackId,
      fullName: fullPayload.fullName,
      dob: new Date(fullPayload.dob),
      age: fullPayload.age,
      mobile: fullPayload.mobile,
      email: fullPayload.email,
      address: fullPayload.address,
      referralCode: fullPayload.referralCode,
      amount: Number(fullPayload.amount),
      transactionId: fullPayload.transactionId,
      paid: true
    });

    return res.status(201).json({ ackId, entryId: entry._id });
  } catch (e) {
    console.error(e);
    // Handle duplicate ack edge case if race: retry once
    if (e.code === 11000) {
      try {
        const prefix = process.env.ACK_PREFIX || 'ACK';
        const seq = await Counter.getNext(COUNTER_NAME);
        const ackId = formatAck(prefix, seq);
        const payload = req.body;
        const entry = await Entry.create({ ...payload, ackId });
        return res.status(201).json({ ackId, entryId: entry._id });
      } catch (err2) {
        console.error(err2);
      }
    }
    return res.status(500).json({ error: 'Failed to create entry' });
  }
});

// Placeholder routes for future features
router.post('/auth/register', (req, res) => {
  return res.status(501).json({ note: 'Registration feature to be implemented.' });
});
router.post('/auth/login', (req, res) => {
  return res.status(501).json({ note: 'Login feature to be implemented.' });
});
router.post('/payments/verify', (req, res) => {
  return res.status(501).json({ note: 'Payment verification to be implemented.' });
});