import { messages } from "./prompt.js";
import { createCommand } from "../utils.js";

export default createCommand(
    (builder) => builder.setName("reset").setDescription("Reset the bot's knowledge"),
    async (interaction) => {
        messages.length = 0;
        await interaction.reply("The Eye has forgor.");
    }
);
