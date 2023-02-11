import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import windows from "windows-battery";

dotenv.config();

const token = process.env.TELEGRAM_TOKEN; // Telegram bot token from @BotFather
const chat_id = +process.env.CHAT_ID; // Your Telegram chat id

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
	const chatId = msg.chat.id;
	if (+chatId !== chat_id) return bot.sendMessage(chatId, "Not Authorized");
	const resp = match[1]; // the captured "whatever"

	switch (resp) {
		case "battery":
			return bot.sendMessage(
				chatId,
				JSON.stringify(windows.battery(), null, 4)
			);
		default:
			return bot.sendMessage(chatId, "Not a Command");
	}
});

setInterval(() => {
	if (+windows.battery().estcharge <= 20 && !windows.battery().ischarging)
		bot.sendMessage(
			chat_id,
			"Charge ME!, I am at " + windows.battery().estcharge
		);
}, 900000);
