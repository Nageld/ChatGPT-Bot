import { openai } from "../apis.js";
import { createCommand } from "../utils.js";
import fetch from "node-fetch";
import { AttachmentBuilder, EmbedBuilder, ButtonStyle } from "discord.js";
import { addComponents } from "discord.js-components";

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
                .setTitle(input.substring(0, 256))
                .setColor("#ffab8a");
            const components = addComponents({
                type: "BUTTON",
                options: [
                    {
                        customId: "variation",
                        style: ButtonStyle.Primary,
                        label: "Variation"
                    }
                ]
            });
            await interaction.editReply({
                embeds: [embed],
                files: [resultAttachment],
                components: components
            });
        } catch (error: any) {
            console.error(error);
            interaction.editReply(error.toString());
        }
    }
);
