const express = require('express');
const path = require('path');
const GameBot = require('./bot');
const config = require('./config');
const { getStats, getTotalStats } = require('./db');

const app = express();
const gameBot = new GameBot();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const [stats, totals] = await Promise.all([
      getStats(),
      getTotalStats()
    ]);
    res.json({ stats, totals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log('Telegram bot is active and listening for commands');
});