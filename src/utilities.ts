import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ButtonInteraction,
    EmbedBuilder
} from "discord.js";
import { readdirSync, readFileSync } from "node:fs";
import { Command, Builder, Button, ConfigSchema } from "./types.js";

export const loadConfig = () =>
    ConfigSchema.parse(JSON.parse(readFileSync("../config.json", "utf8")));

export const createCommand = (
    build: (builder: SlashCommandBuilder) => Builder,
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
) => {
    return {
        data: build(new SlashCommandBuilder()),
        execute
    };
};

export const collectCommands = async () => {
    const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"));
    const commands: Command[] = [];
    for (const file of commandFiles) {
        const command = (await import(`./commands/${file}`)) as unknown as { default: Command };
        commands.push(command.default);
    }
    return commands;
};

export const createButton = (
    id: string,
    execute: (interaction: ButtonInteraction) => Promise<void>
) => {
    return {
        id,
        execute
    };
};

export const collectButtons = async () => {
    const buttonFiles = readdirSync("./buttons").filter((file) => file.endsWith(".js"));
    const buttons: Button[] = [];
    for (const file of buttonFiles) {
        const button = (await import(`./buttons/${file}`)) as unknown as { default: Button };
        buttons.push(button.default);
    }
    return buttons;
};

export const createResponseEmbed = (input: string) =>
    new EmbedBuilder().setTitle(input.slice(0, 256)).setColor("#ffab8a");

export const embedFailure = (embed: EmbedBuilder, reason = "Unknown Error") =>
    embed.setColor("Red").setDescription(`Failure: ${reason}`);
