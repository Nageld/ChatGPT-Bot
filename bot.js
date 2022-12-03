import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import settings from './config.json' assert { type: 'json' };;
import command from './commands/server.js'
import reset from './commands/reset.js'
import {ChatGPTAPI} from 'chatgpt';

const api = new ChatGPTAPI({headless:true})
// {headless:true}
await api.init({ auth: 'blocking' })


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let command2 = command.command
let command3 = reset.command

client.commands = new Collection();
client.commands.set(command2.name, command)
client.commands.set(command3.name, reset)

// for (const file of commandFiles) {
//     const filePath = join(commandsPath, file);
//     client.commands.set(command.name, command);
// }
client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction.commandName)
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, api);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    if (interaction.commandName == "reset") {
        api.init()
    }
});

client.login(settings.token);