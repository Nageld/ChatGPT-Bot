import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import { getPromptResponse } from "./prompt.js";
import { prompt } from "../apis.js";

export default createCommand(
    (builder) =>
        builder
            .setName("single-prompt")
            .setDescription("Send a prompt to a blank chatgpt instance")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        let embed = createResponseEmbed(input);
        await interaction.reply({ embeds: [embed] });
        try {
            const response = await getPromptResponse([prompt, { "role": "user", "content": `${input}` }]);
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
