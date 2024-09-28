import { prompt } from "../apis.js";
import { Builder } from "../types.js";
import { createCommand, createResponseEmbed } from "../utils.js";

export default createCommand(
    (builder: Builder) =>
        builder.setName("getprompt").setDescription("See the bot's current prompt"),
    async (interaction) => {
        const embed = createResponseEmbed("The current prompt is:");
        embed.setDescription(prompt.content?.toString() ?? "");
        await interaction.reply({ embeds: [embed] });
    }
);
