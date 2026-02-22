import { messages } from "./prompt.js";
import { createCommand } from "../utilities.js";
import { prompt } from "../apis.js";
import { Builder } from "../types.js";

export default createCommand(
    (builder: Builder) => builder.setName("reset").setDescription("Reset the bot's knowledge"),
    async (interaction) => {
        messages.length = 0;
        messages.push(prompt);
        await interaction.reply("The Eye has forgor.");
    }
);
