import { EmbedBuilder } from "discord.js";
import { chatgpt } from "../apis.js";
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
            const response = (await chatgpt.sendMessage(input)).substring(0, 4096);
            embed.setDescription(response).setFooter({ text: `length: ${response.length}` });
            await interaction.editReply({ embeds: [embed] });
        } catch (error: any) {
            console.error(error);
            embed.setDescription(error.toString());
            await interaction.editReply({ embeds: [embed] });
        }
    }
);
