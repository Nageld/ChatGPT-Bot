import { EmbedBuilder } from "discord.js";
import { openai, singleTokens } from "../apis.js";
import { createCommand } from "../utils.js";

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
        const embed = new EmbedBuilder().setTitle(input.substring(0, 256)).setColor("#ffab8a");
        await interaction.reply({ embeds: [embed] });
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: input,
                temperature: 0,
                max_tokens: singleTokens,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            });
            console.log(response.data);
            if (!response.data.choices[0].text) {
                embed.setDescription("failed".substring(0, 4096));
                await interaction.editReply({ embeds: [embed] });
            } else {
                const output =
                    response.data.choices[0].text.length > 0
                        ? response.data.choices[0].text
                        : "empty";
                embed.setDescription(output.substring(0, 4096)).setFooter({
                    text: `untruncated length: ${output.length}, tokens: ${response.data.usage?.total_tokens}`
                });
                await interaction.editReply({ embeds: [embed] });
            }
        } catch (error: any) {
            console.error(error);
            embed.setDescription(error.toString());
            await interaction.editReply({ embeds: [embed] });
        }
    }
);
