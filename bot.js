import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import settings from './config.json' assert { type: 'json' };;
import prompt from './commands/prompt.js'
import reset from './commands/reset.js'
import { ChatGPTAPI } from 'chatgpt';

export const api = new ChatGPTAPI({ headless: true })
await api.init({ auth: 'blocking' })

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let promptCommand = prompt.command
let resetCommand = reset.command

client.commands = new Collection();
client.commands.set(promptCommand.name, prompt)
client.commands.set(resetCommand.name, reset)

client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(settings.token);
