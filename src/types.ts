import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type Builder =
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export interface Command {
    data: Builder;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
