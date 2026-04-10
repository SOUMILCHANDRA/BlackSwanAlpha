const { server } = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Optional: Run migrations or check DB connection
    await pool.query('SELECT NOW()');
    console.log('Database connection verified.');

    server.listen(PORT, () => {
      console.log(`Disaster Alpha Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
