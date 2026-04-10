const db = require('./src/config/db');

async function seed() {
  try {
    console.log('Seeding initial events and data...');
    
    // Some historic-style events
    const events = [
      ['EQ-TOK-001', 'earthquake', 7.2, 35.6895, 139.6917, 'Tokyo, Japan', new Date()],
      ['WF-CA-002', 'wildfire', 5.5, 34.0522, -118.2437, 'Los Angeles, CA', new Date()],
      ['HK-FL-003', 'hurricane', 4.0, 25.7617, -80.1918, 'Miami, FL', new Date()]
    ];

    for (const event of events) {
      await db.query(
        `INSERT INTO events (external_id, type, magnitude, latitude, longitude, region, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (external_id) DO NOTHING`,
        event
      );
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
