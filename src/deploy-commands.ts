import { REST, Routes } from "discord.js";
import { collectCommands, loadConfig } from "./utils.js";

const config = loadConfig();

const commands = await collectCommands();
const commandMap = commands.map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.token);

try {
    console.log(`Started refreshing ${commandMap.length.toString()} application (/) commands.`);

    const data = (await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
        body: commandMap
    })) as { length: number };

    console.log(`Successfully reloaded ${data.length.toString()} application (/) commands.`);
} catch (error) {
    console.error(error);
}
