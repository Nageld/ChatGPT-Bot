import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import { getPromptResponse } from "./prompt.js";
import { prompt } from "../apis.js";

export default createCommand(
    (builder) =>
        builder
            .setName("identufy")
            .setDescription("Use the vision")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            )
            .addStringOption((option) =>
                option.setName("imageurl").setDescription("Link to image")
            )
            .addAttachmentOption((option) =>
                option.setName("image").setDescription("image")
            ),
    async (interaction) => {
        const image = interaction.options.getAttachment("image") ? interaction.options.getAttachment("image")?.proxyURL : interaction.options.getString("imageurl")
        const input = interaction.options.getString("input")!;
        let embed = createResponseEmbed(input);
        await interaction.reply({ embeds: [embed] });
        try {
            const response = await getPromptResponse([
                prompt,
                {
                    "role": "user",
                    "content": JSON.stringify([
                        { type: "text", text: `${input}` },
                        {
                            type: "image_url",
                            image_url: {
                                "url": `${image}`,
                                "detail": "low"
                            }
                        }
                    ])
                }
            ]);
            const answer = response.data.choices[0].message!.content;
            if (answer) {
                const output = answer.length === 0 ? "(Empty)" : answer;
                embed.setDescription(output.substring(0, 4096))
            } else {
                embedFailure(embed);
            }
        } catch (error: any) {
            console.error(error);
            embed = embedFailure(embed, error.toString());
        } finally {
            await interaction.editReply({ embeds: [embed] });
        }
    }
);
