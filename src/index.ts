import { Client, Events, GatewayIntentBits, Interaction } from "discord.js";
import { processQueueLoop } from "./commands/prompt.js";
import { collectButtons, collectCommands, loadConfig } from "./utils.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = await collectCommands();
const commandMap = Object.fromEntries(commands.map((command) => [command.data.name, command]));

const buttons = await collectButtons();
const buttonMap = Object.fromEntries(buttons.map((button) => [button.id, button]));

const clientReady = async () => {
    console.log("Ready!");
    await processQueueLoop();
};

client.once(Events.ClientReady, () => void clientReady());

const interactionCreateCallback = async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = commandMap[interaction.commandName];

        await command.execute(interaction);
    } else if (interaction.isButton()) {
        const button = buttonMap[interaction.customId];

        await button.execute(interaction);
    }
};
client.on(Events.InteractionCreate, (interaction) => void interactionCreateCallback(interaction));

const config = loadConfig();

await client.login(config.token);
