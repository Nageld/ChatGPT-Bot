import { REST, Routes } from "discord.js";
import { collectCommands, loadConfig } from "./utils.js";

const config = loadConfig();

const commands = (await collectCommands()).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.token);

try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = (await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
        body: commands
    })) as { length: number };

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    console.error(error);
}
