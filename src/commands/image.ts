import { huggingfaceKey, imageModel } from "../apis.js";
import { createCommand, createResponseEmbed, embedFailure } from "../utilities.js";
import fetch from "node-fetch";
import { AttachmentBuilder, SlashCommandStringOption } from "discord.js";
import { Builder } from "../types.js";

async function getContent(data: string, model: string) {
    const requestData = {
        inputs: data,
        options: {
            use_cache: false,
            wait_for_model: true
        }
    };

    const response = await fetch(model, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + huggingfaceKey
        },
        body: JSON.stringify(requestData)
    });
    return response;
}
export default createCommand(
    (builder: Builder) =>
        builder
            .setName("image")
            .setDescription("Prompt for the bot")
            .addStringOption((option: SlashCommandStringOption) =>
                option.setName("input").setRequired(true).setDescription("The image description")
            )
            .addStringOption((option: SlashCommandStringOption) =>
                option.setName("model").setRequired(false).setDescription("The model url")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input") ?? "N/A";
        const seed = interaction.options.getString("model")?.toLowerCase() ?? imageModel.url;
        await interaction.deferReply();
        try {
            const response = await getContent(input, seed);
            if (!response.ok) {
                console.log(response);
            }
            const arrayBuffer = await response.arrayBuffer(); // Convert ReadableStream to ArrayBuffer
            const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
            const resultAttachment = new AttachmentBuilder(buffer, {
                name: "result.png"
            });
            const embed = createResponseEmbed(input).setImage("attachment://result.png");

            await interaction.editReply({
                embeds: [embed],
                files: [resultAttachment]
            });
        } catch (error: unknown) {
            console.error(error);
            const embed = embedFailure(createResponseEmbed(input));
            await interaction.editReply({ embeds: [embed] });
        }
    }
);
