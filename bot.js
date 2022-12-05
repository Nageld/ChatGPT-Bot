import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import config from './config.json' assert { type: 'json' };
import { ChatGPTAPI } from 'chatgpt';
import { OpenAIApi } from 'openai';
import { processQueueLoop } from './commands/prompt.js'
import { readdirSync } from 'fs';

export const openai = new OpenAIApi({ apiKey: config.openai });
export const chatgpt = new ChatGPTAPI({ headless: true })
await chatgpt.init({ auth: 'blocking' })

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	client.commands.set(command.default.data.name, command.default)
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
	processQueueLoop()
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction, openai, chatgpt);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(config.token);
