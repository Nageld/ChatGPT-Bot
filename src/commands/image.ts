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
            const response = await openai.createImage({
                prompt: input,
                n: 1,
                size: "1024x1024"
            });
            const imageResponse = await fetch(response.data.data[0].url!);
            const resultAttachment = new AttachmentBuilder(imageResponse.body!, {
                name: "result.png"
            });
            const embed = new EmbedBuilder()
                .setImage("attachment://result.png")
                .setTitle(input.substring(0, 256));
            await interaction.editReply({ embeds: [embed], files: [resultAttachment] });
        } catch (error: any) {
            console.error(error);
            interaction.editReply(error.toString());
        }
    }
);
