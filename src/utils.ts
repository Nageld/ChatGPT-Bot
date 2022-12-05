import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { readFileSync } from "fs";
import { Command, Builder } from "./types.js";

export const loadConfig = async () => JSON.parse(readFileSync('../config.json', "utf-8"));

export const createCommand = (build: (builder: SlashCommandBuilder) => Builder, execute: (interaction: ChatInputCommandInteraction) => Promise<void>) => {
    return {
        data: build(new SlashCommandBuilder()),
        execute
    } as Command;
};
