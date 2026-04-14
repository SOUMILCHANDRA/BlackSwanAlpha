const express = require('express');
const axios = require('axios');
const db = require('../config/db');
const router = express.Router();

router.post('/emdat', async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }

  try {
    console.log(`Starting EMDAT ingestion from: ${filePath}`);
    
    // 1. Call Analytics Service to parse the file
    // Note: If running in Docker, localhost:8000 might need to be 'analytics:8000'
    const analyticsUrl = process.env.ANALYTICS_SERVICE_URL || 'http://analytics:8000';
    const response = await axios.get(`${analyticsUrl}/ingest/emdat`, {
      params: { file_path: filePath }
    });

    const { events } = response.data;
    console.log(`Parsed ${events.length} events. Inserting into database...`);

    let insertedCount = 0;
    for (const event of events) {
      try {
        await db.query(
          `INSERT INTO events (external_id, type, magnitude, latitude, longitude, region, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (external_id) DO NOTHING`,
          [
            event.external_id,
            event.type,
            event.magnitude,
            event.latitude,
            event.longitude,
            event.region,
            new Date(event.timestamp)
          ]
        );
        insertedCount++;
      } catch (dbErr) {
        console.error(`Failed to insert event ${event.external_id}:`, dbErr.message);
      }
    }

    res.json({
      status: 'success',
      message: `Successfully processed EMDAT file.`,
      parsed: events.length,
      inserted: insertedCount
    });

  } catch (err) {
    console.error('EMDAT Ingestion Error:', err.message);
    res.status(500).json({
      error: 'Failed to ingest EMDAT data',
      details: err.response?.data?.detail || err.message
    });
  }
});

module.exports = router;
