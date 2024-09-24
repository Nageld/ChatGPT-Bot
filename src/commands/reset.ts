import { messages } from "./prompt.js";
import { createCommand } from "../utils.js";
import { prompt } from "../apis.js";

export default createCommand(
    (builder: any) => builder.setName("reset").setDescription("Reset the bot's knowledge"),
    async (interaction) => {
        messages.length = 0;
        messages.push(prompt)      
        await interaction.reply("The Eye has forgor.");
    }
);
