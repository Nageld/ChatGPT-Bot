import { SlashCommandStringOption } from "discord.js";
import { imageModel } from "../apis.js";
import { Builder } from "../types.js";
import { createCommand, createResponseEmbed } from "../utils.js";
import { messages } from "./prompt.js";

export default createCommand(
    (builder: Builder) =>
        builder
            .setName("setimage")
            .setDescription("Set the default image model for the bot")
            .addStringOption((option: SlashCommandStringOption) =>
                option.setName("input").setRequired(true).setDescription("The model url")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input") ?? "N/A";
        imageModel.url = input;
        messages[0].content = input;
        const embed = createResponseEmbed("The current default image model is:");
        embed.setDescription(input);
        await interaction.reply({ embeds: [embed] });
    }
);
