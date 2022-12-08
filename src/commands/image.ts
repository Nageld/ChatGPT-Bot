import { openai } from "../apis.js";
import { createCommand } from "../utils.js";
import fetch from "node-fetch";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";

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
        await interaction.deferReply();
        try {
            const inputFormatted = input
                .split("\n")
                .map((x) => x)
                .join("\n");
            const response = await openai.createImage({
                prompt: input,
                n: 1,
                size: "1024x1024"
            });
            const imageResponse = await fetch(response.data.data[0].url!);
            const resultAttachment = new AttachmentBuilder(imageResponse.body!, {
                name: "result.png"
            });
            const embeds = [
                new EmbedBuilder()
                    .setURL("https://gorp.com/")
                    .setImage("attachment://result.png")
                    .setTitle(inputFormatted.substring(0, 255))
            ];

            await interaction.editReply({ embeds: embeds, files: [resultAttachment] });
            // await interaction.editReply({ content: inputFormatted, files: [resultAttachment] });
        } catch (e) {
            await interaction.editReply("Failed to generate image");
        }
    }
);
