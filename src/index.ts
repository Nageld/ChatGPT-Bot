import { Client, Events, GatewayIntentBits } from "discord.js";
import { processQueueLoop } from "./commands/prompt.js";
import { collectButtons, collectCommands, loadConfig } from "./utils.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = Object.fromEntries(
    (await collectCommands()).map((command) => [command.data.name, command])
);

const buttons = Object.fromEntries((await collectButtons()).map((button) => [button.id, button]));

client.once(Events.ClientReady, () => {
    console.log("Ready!");
    processQueueLoop();
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = commands[interaction.commandName];
        if (!command) return;

        await command.execute(interaction);
    } else if (interaction.isButton()) {
        const button = buttons[interaction.customId];
        if (!button) return;

        await button.execute(interaction);
    }
});

const config = loadConfig();

client.login(config.token);
