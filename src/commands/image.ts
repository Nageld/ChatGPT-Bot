import { huggingfaceKey, imageModel } from "../apis.js";
import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import fetch from "node-fetch";
import { AttachmentBuilder } from "discord.js";

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
    (builder: any) =>
        builder
            .setName("image")
            .setDescription("Prompt for the bot")
            .addStringOption((option: any) =>
                option.setName("input").setRequired(true).setDescription("The image description")
            )    .addStringOption((option: any) => option.setName("model").setRequired(false).setDescription("The model url")),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        const seed = interaction.options.getString("model")?.toLowerCase() ?? imageModel.url;
        await interaction.deferReply();
        try {
            const response = await getContent(input, seed);
            if (!response.ok) {
                console.log(response);
            }
            const arrayBuffer = await response.arrayBuffer();  // Convert ReadableStream to ArrayBuffer
            const buffer = Buffer.from(arrayBuffer);  // Convert ArrayBuffer to Buffer
            const resultAttachment = new AttachmentBuilder(buffer, {
                name: "result.png",
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
