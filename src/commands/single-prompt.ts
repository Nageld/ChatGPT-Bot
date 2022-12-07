import { chatgpt } from "../apis.js";
import { createCommand } from "../utils.js";

export default createCommand(
    (builder) =>
        builder
            .setName("single-prompt")
            .setDescription("Send a prompt to a blank chatgpt instance")
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
        try {
            const response = await chatgpt.sendMessage(input);
            await interaction.editReply(`${inputFormatted}\n${response}`.substring(0, 2000));
        } catch {
            await interaction.editReply(`${inputFormatted}\nFailed`.substring(0, 2000));
        }
    }
);
