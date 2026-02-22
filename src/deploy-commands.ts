import { REST, Routes } from "discord.js";
import { collectCommands, loadConfig } from "./utilities.js";
import { z } from "zod";

const config = loadConfig();

const commands = await collectCommands();
const commandMap = commands.map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.token);

const guildCommandSchema = z.array(z.unknown());

try {
    console.log(`Started refreshing ${commandMap.length.toString()} application (/) commands.`);

    const data = guildCommandSchema.parse(
        await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
            body: commandMap
        })
    );

    console.log(`Successfully reloaded ${data.length.toString()} application (/) commands.`);
} catch (error) {
    console.error(error);
}
