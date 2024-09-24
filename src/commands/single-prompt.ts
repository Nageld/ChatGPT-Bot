import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import { getPromptResponse } from "./prompt.js";
import { prompt } from "../apis.js";
import { Builder } from "../types.js";
import { SlashCommandStringOption } from "discord.js";

export default createCommand(
    (builder: Builder) =>
        builder
            .setName("single-prompt")
            .setDescription("Send a prompt to a blank chatgpt instance")
            .addStringOption((option: SlashCommandStringOption) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input") ?? "N/A";
        let embed = createResponseEmbed(input);
        await interaction.reply({ embeds: [embed] });
        try {
            const response = await getPromptResponse([prompt, { role: "user", content: input }]);
            const answer = response.choices[0].message.content;
            if (answer) {
                const output = answer.length === 0 ? "(Empty)" : answer;
                embed.setDescription(output.slice(0, 4096));
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
