import express from 'express';
import db from '../../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { email } = req.body;

    const result = await db.query(
      'UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email',
      [email, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;