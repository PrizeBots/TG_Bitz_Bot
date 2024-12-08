require('dotenv').config();

const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  gameUrl: process.env.GAME_URL,
  port: process.env.PORT || 3000,
  gameShortName: process.env.GAME_SHORT_NAME
};

module.exports = config;