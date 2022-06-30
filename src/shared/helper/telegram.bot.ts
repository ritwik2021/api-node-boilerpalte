import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Tgfancy from 'tgfancy';

// telegram bot for sending messages
export async function telegramBot(msg: string) {
  try {
    const configService = new ConfigService();
    const chatID = configService.get('TELEGRAM_CHAT_ID');

    // Create a bot that uses 'emojification'
    const bot = new Tgfancy(configService.get('TELEGRAM_BOT_API_KEY'), {
      tgfancy: {
        emojification: true
      }
    });

    // Create a bot that send new updates
    bot.sendMessage(chatID, `${msg} :rocket:`);
  } catch (error) {
    Logger.error(error.message, 'TelegramBot.botSendMsg');
  }
}
