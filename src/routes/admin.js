import express from 'express';
import { Entry } from '../models/Entry.js';

const router = express.Router();

/**
 * @route   GET /api/admin/entries
 * @desc    Get all user entries (admin panel)
 * @access  Private (You can later add JWT auth or admin middleware)
 */
router.get('/entries', async (req, res) => {
  try {
    // Optional: pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Optional: search by name/email/mobile
    const search = req.query.search || "";
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const entries = await Entry.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    const total = await Entry.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: entries,
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
