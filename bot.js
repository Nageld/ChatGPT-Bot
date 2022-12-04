import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import config from './config.json' assert { type: 'json' };
import prompt, { processQueueLoop } from './commands/prompt.js'
import reset from './commands/reset.js'
import { ChatGPTAPI } from 'chatgpt';

export const api = new ChatGPTAPI({ headless: true })
await api.init({ auth: 'blocking' })

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = new Collection();
commands.set(prompt.command.name, prompt)
commands.set(reset.command.name, reset)

client.once(Events.ClientReady, () => {
    console.log('Ready!');
    processQueueLoop()
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(config.token);
