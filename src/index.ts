import { Client, Events, GatewayIntentBits } from "discord.js";
import { processQueueLoop } from "./commands/prompt.js";
import { chatgpt } from "./apis.js";
import { collectCommands, loadConfig } from "./utils.js";

await chatgpt.init({ auth: "blocking" });

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

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        });
    }
});

const config = await loadConfig();

client.login(config.token);
