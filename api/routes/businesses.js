import express from 'express';
import db from '../../lib/db.js';

const router = express.Router();

// Create a new business
router.post('/', async (req, res) => {
  try {
    const business = await db.createBusiness(req.body);
    res.json(business);
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ error: 'Failed to create business' });
  }
});

// Get all businesses for a user
router.get('/:userId', async (req, res) => {
  try {
    const businesses = await db.getBusinesses(req.params.userId);
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// Update a business
router.put('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE businesses SET
        name = $1, website = $2, phone = $3, email = $4,
        address = $5, city = $6, postal_code = $7,
        business_type = $8, employee_count = $9,
        updated_at = NOW()
        WHERE id = $10 AND user_id = $11
        RETURNING *`,
      [
        req.body.name,
        req.body.website,
        req.body.phone,
        req.body.email,
        req.body.address,
        req.body.city,
        req.body.postal_code,
        req.body.business_type,
        req.body.employee_count,
        req.params.id,
        req.body.user_id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Failed to update business' });
  }
});

// Delete a business
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM businesses WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.query.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Failed to delete business' });
  }
});

export default router;