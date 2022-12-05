import { openai } from "../apis.js";
import { createCommand } from "../utils.js";

export default createCommand(
    (builder) =>
        builder
            .setName("image")
            .setDescription("Prompt for the bot")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The image description")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        const inputFormatted = input
            .split("\n")
            .map((x) => `> ${x}`)
            .join("\n");
        await interaction.reply(`> ${inputFormatted}`.substring(0, 2000));
        const response = await openai.createImage({
            prompt: input,
            n: 1,
            size: "1024x1024"
        });
        await interaction.editReply(
            `> ${inputFormatted}\n${response.data.data[0].url}`.substring(0, 2000)
        );
    }
);
