import TelegramBot from "node-telegram-bot-api"

export function createTelegramApi() {
  const token = process.env.TELEGRAM_TOKEN
  const bot = new TelegramBot(token, { polling: false })
  return bot
}
