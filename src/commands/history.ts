import { messages } from "./prompt.js";
import { createCommand, createResponseEmbed } from "../utils.js";

export default createCommand(
    (builder) => builder.setName("history").setDescription("See the bot's current knowledge"),
    async (interaction) => {
        const embed = createResponseEmbed("History");
        if (messages.length === 0) {
            embed.setDescription("No history");
        } else {
            embed.setDescription(messages.join("\n").substring(0, 4096));
        }
        await interaction.reply({ embeds: [embed] });
    }
);
