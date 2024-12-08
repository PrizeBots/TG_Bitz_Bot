const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS user_interactions (
    user_id INTEGER PRIMARY KEY,
    play_clicks INTEGER DEFAULT 0,
    share_clicks INTEGER DEFAULT 0
  )`);
});

const trackInteraction = (userId, type) => {
  const column = type === 'play' ? 'play_clicks' : 'share_clicks';
  db.run(`INSERT INTO user_interactions (user_id, ${column}) 
          VALUES (?, 1) 
          ON CONFLICT(user_id) DO UPDATE 
          SET ${column} = ${column} + 1`, userId);
};

const getStats = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT user_id, play_clicks, share_clicks FROM user_interactions`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getTotalStats = () => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT 
      SUM(play_clicks) as total_plays,
      SUM(share_clicks) as total_shares
      FROM user_interactions`, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = { trackInteraction, getStats, getTotalStats };