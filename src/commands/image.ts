import { openai } from "../apis.js";
import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import fetch from "node-fetch";
import { AttachmentBuilder, ButtonStyle } from "discord.js";
import { addComponents, Button } from "discord.js-components";

export const variationButton = {
    type: "BUTTON",
    options: [
        {
            customId: "variation",
            style: ButtonStyle.Primary,
            label: "Variation"
        }
    ]
} as Button;

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
            const embed = createResponseEmbed(input).setImage("attachment://result.png");
            const components = addComponents(variationButton);
            await interaction.editReply({
                embeds: [embed],
                files: [resultAttachment],
                components: components
            });
        } catch (error: any) {
            console.error(error);
            const embed = embedFailure(createResponseEmbed(input));
            interaction.editReply({ embeds: [embed] });
        }
    }
);
