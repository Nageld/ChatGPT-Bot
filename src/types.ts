import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder
} from "discord.js";
import { z } from "zod";

export type Builder = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

export interface Command {
    data: Builder;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface Button {
    id: string;
    execute(interaction: ButtonInteraction): Promise<void>;
}

export const ConfigSchema = z.object({
    token: z.string(),
    openai: z.string(),
    clientId: z.string(),
    guildId: z.string(),
    singleTokens: z.number().int().positive(),
    promptTokens: z.number().int().positive(),
    historySize: z.number().int().nonnegative(),
    huggingface: z.string()
});
export type Config = z.infer<typeof ConfigSchema>;
