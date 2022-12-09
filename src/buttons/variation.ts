import { openai } from "../apis.js";
import fetch from "node-fetch";
import { AttachmentBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import { createButton } from "../utils.js";
import { addComponents } from "discord.js-components";

export default createButton("variation", async (interaction: ButtonInteraction): Promise<void> => {
    const input = interaction.message.embeds.at(0)?.image?.url ?? "";
    await interaction.deferReply();
    try {
        const baseImage = await fetch(input);
        const file: any = baseImage.body!;
        file.name = "before.png";
        const response = await openai.createImageVariation(file, 1, "1024x1024");
        const imageResponse = await fetch(response.data.data[0].url!);
        const afterAttachment = new AttachmentBuilder(imageResponse.body!, {
            name: "result.png"
        });
        const embeds = new EmbedBuilder()
            .setImage("attachment://result.png")
            .setTitle(input.substring(0, 256));
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
            embeds: [embeds],
            files: [afterAttachment],
            components: components
        });
    } catch (error: any) {
        console.error(error);
        interaction.editReply(error.toString());
    }
});
