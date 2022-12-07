import { chatgpt } from "../apis.js";
import { createCommand } from "../utils.js";

export default createCommand(
    (builder) =>
        builder
            .setName("ask")
            .setDescription("Query a new fresh chatgpt instance")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        const inputFormatted = input
            .split("\n")
            .map((x) => `> ${x}`)
            .join("\n");
        await interaction.reply(inputFormatted.substring(0, 2000));
        const response = await chatgpt.sendMessage(input);
        await interaction.editReply(`${inputFormatted}\n${response}`.substring(0, 2000));
    }
);