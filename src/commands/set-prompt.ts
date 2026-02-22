import { SlashCommandStringOption } from "discord.js";
import { prompt } from "../apis.js";
import { Builder } from "../types.js";
import { createCommand, createResponseEmbed } from "../utilities.js";
import { messages } from "./prompt.js";

export default createCommand(
    (builder: Builder) =>
        builder
            .setName("setprompt")
            .setDescription("Set the prompt for the bot")
            .addStringOption((option: SlashCommandStringOption) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input") ?? "N/A";
        prompt.content = input;
        messages[0].content = input;
        const embed = createResponseEmbed("The current system message is now:");
        embed.setDescription(input);
        await interaction.reply({ embeds: [embed] });
    }
);
