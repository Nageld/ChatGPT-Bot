import { chatgpt } from "../apis.js";
import { createCommand } from "../utils.js";

export default createCommand(
    (builder) => builder.setName("reset").setDescription("Reset the bots knowledge"),
    async (interaction) => {
        await chatgpt.close();
        await chatgpt.init();
        await interaction.reply("The Eye has forgor.");
    }
);
