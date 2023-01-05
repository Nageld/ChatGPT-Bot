import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import { getPromptResponse } from "./prompt.js";

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
            const response = (await getPromptResponse(input)).data;
            console.log(response);
            const answer = response.choices[0]?.text;
            if (answer) {
                const output = answer.length === 0 ? "(Empty)" : answer;
                embed.setDescription(output.substring(0, 4096)).setFooter({
                    text: `untruncated length: ${output.length}, tokens: ${response.usage?.total_tokens}`
                });
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
