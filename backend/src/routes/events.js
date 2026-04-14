const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET /api/events - Get all events (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { type, limit } = req.query;
    let query = 'SELECT * FROM events';
    const params = [];

    if (type && type !== 'all') {
      query += ' WHERE type = $1';
      params.push(type);
    }

    query += ' ORDER BY timestamp DESC LIMIT $2';
    params.push(limit || 100);

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get specific event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching event detail:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
