import { messages } from "./prompt.js";
import { createCommand } from "../utils.js";
import { EmbedBuilder } from "discord.js";

export default createCommand(
    (builder) => builder.setName("history").setDescription("See the bot's knowledge"),
    async (interaction) => {
        const embed = new EmbedBuilder().setTitle("History").setColor("#ffab8a");
        if (messages.length == 0) {
            embed.setDescription("No history");
        } else {
            embed.setDescription(messages.join("\n").substring(0, 4096));
        }
        await interaction.reply({ embeds: [embed] });
    }
);
