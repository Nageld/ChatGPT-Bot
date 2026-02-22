import { prompt } from "../apis.js";
import { Builder } from "../types.js";
import { createCommand, createResponseEmbed } from "../utilities.js";

export default createCommand(
    (builder: Builder) =>
        builder.setName("getprompt").setDescription("See the bot's current prompt"),
    async (interaction) => {
        const embed = createResponseEmbed("The current prompt is:");
        let description = prompt.content;
        if (typeof description !== "string") {
            description = JSON.stringify(description);
        }
        embed.setDescription(description);
        await interaction.reply({ embeds: [embed] });
    }
);
