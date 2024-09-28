import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import { getPromptResponse } from "./prompt.js";
import { prompt } from "../apis.js";
import { Builder } from "../types.js";
import { SlashCommandAttachmentOption, SlashCommandStringOption } from "discord.js";

export default createCommand(
    (builder: Builder) =>
        builder
            .setName("identify")
            .setDescription("Use the vision")
            .addStringOption((option: SlashCommandStringOption) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            )
            .addStringOption((option: SlashCommandStringOption) =>
                option.setName("imageurl").setDescription("Link to image")
            )
            .addAttachmentOption((option: SlashCommandAttachmentOption) =>
                option.setName("image").setDescription("image")
            ),
    async (interaction) => {
        const image =
            (interaction.options.getAttachment("image")
                ? interaction.options.getAttachment("image")?.proxyURL
                : interaction.options.getString("imageurl")) ??
            "https://upload.wikimedia.org/wikipedia/commons/f/ff/Asparagus_soup_%28spargelsuppe%29.jpg";
        const input = interaction.options.getString("input") ?? "N/A";
        let embed = createResponseEmbed(input);
        await interaction.reply({ embeds: [embed] });
        try {
            const response = await getPromptResponse([
                prompt,
                {
                    role: "user",
                    content: [
                        { type: "text", text: input },
                        {
                            type: "image_url",
                            image_url: {
                                url: image,
                                detail: "high"
                            }
                        }
                    ]
                }
            ]);
            const answer = response.choices[0].message.content;
            if (answer) {
                const output = answer.length === 0 ? "(Empty)" : answer;
                embed.setDescription(output.slice(0, 4096));
                embed.setImage(image);
            } else {
                embedFailure(embed);
            }
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                embed = embedFailure(embed, error.toString());
            }
        } finally {
            await interaction.editReply({ embeds: [embed] });
        }
    }
);
