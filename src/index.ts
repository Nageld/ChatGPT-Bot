import { Client, Events, GatewayIntentBits } from "discord.js";
import { processQueueLoop } from "./commands/prompt.js";
import { collectCommands, loadConfig } from "./utils.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = Object.fromEntries(
    (await collectCommands()).map((command) => [command.data.name, command])
);

client.once(Events.ClientReady, () => {
    console.log("Ready!");
    processQueueLoop();
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands[interaction.commandName];
    if (!command) return;

    await command.execute(interaction);
});

const config = loadConfig();

client.login(config.token);
