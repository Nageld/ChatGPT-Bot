import { chatgpt } from "../apis.js";
import { createCommand } from "../utils.js";

export default createCommand(
    (builder) => builder.setName("reset").setDescription("Reset the bot's knowledge"),
    async (interaction) => {
        await interaction.reply("The Eye has forgor.");
    }
);
