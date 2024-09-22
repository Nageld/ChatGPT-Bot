import { huggingfaceKey } from "../apis.js";
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



async function getContent(data: any, model: any) {

    let data2 ={
        inputs : data,
        options : {
            use_cache : false,
            wait_for_model : true,
        }
    };
    
	let response = await fetch(model, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ` + huggingfaceKey
        },
        body: JSON.stringify(data2)
    });
    return response
}
export default createCommand(
    (builder) =>
        builder
            .setName("image")
            .setDescription("Prompt for the bot")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The image description")
            )    .addStringOption((option) => option.setName("model").setRequired(false).setDescription("The model url")),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        const seed = interaction.options.getString("model")?.toLowerCase() ?? "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
        await interaction.deferReply();
        try {
            const response = await getContent(input, seed)
            if (!response.ok) {
                console.log(response)
            }
            const resultAttachment = new AttachmentBuilder(response.body!, {
                name: "result.png"
            });
            const embed = createResponseEmbed(input).setImage("attachment://result.png");
            await interaction.editReply({
                embeds: [embed],
                files: [resultAttachment],
            });
        } catch (error: any) {
            console.error(error);
            const embed = embedFailure(createResponseEmbed(input));
            interaction.editReply({ embeds: [embed] });
        }
    }
);
