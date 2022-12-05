import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { readdirSync, readFileSync } from "fs";
import { Command, Builder } from "./types.js";

export const loadConfig = () => JSON.parse(readFileSync("../config.json", "utf-8"));

export const createCommand = (
    build: (builder: SlashCommandBuilder) => Builder,
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
) => {
    return {
        data: build(new SlashCommandBuilder()),
        execute
    } as Command;
};

export const collectCommands = async () => {
    const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"));
    const commands: Command[] = [];
    for (const file of commandFiles) {
        const command = await import(`./commands/${file}`);
        commands.push(command.default);
    }
    return commands;
};
