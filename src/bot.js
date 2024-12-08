const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { trackInteraction } = require('./db');

class GameBot {
  constructor() {
    this.bot = new TelegramBot(config.telegramToken, { polling: true });
    this.setupHandlers();
  }

  setupHandlers() {
    // Handle /start command
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, 'Hello there! Type /game to go!');
    });

    // Handle 'yo' message
    this.bot.onText(/yo/i, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, "what's up?");
    });

    // Handle /game command
    this.bot.onText(/\/game/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendGame(chatId, config.gameShortName, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🎮 Play Game', callback_game: {} },
              { 
                text: '📢 Share Game', 
                url: 'https://t.me/DrBitz_Bot?game=BitFighters',
                callback_data: 'share'
              }
            ]
          ]
        }
      });
    });

    // Handle callback queries (when user clicks Play Game button)
    this.bot.on('callback_query', (query) => {
      if (query.data === 'share') {
        trackInteraction(query.from.id, 'share');
        this.bot.answerCallbackQuery(query.id);
      } else if (query.game_short_name) {
        trackInteraction(query.from.id, 'play');
        this.bot.answerCallbackQuery(query.id, {
          url: config.gameUrl
        });
      } 
    });

  }
}

module.exports = GameBot;