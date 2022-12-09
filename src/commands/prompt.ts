import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import delay from "delay";
import { conversation } from "../apis.js";
import { createCommand } from "../utils.js";

type QueueItem = { interaction: ChatInputCommandInteraction; input: string };

const queue: QueueItem[] = [];

export default createCommand(
    (builder) =>
        builder
            .setName("prompt")
            .setDescription("Prompt for the bot")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        const embed = new EmbedBuilder().setTitle(input.substring(0, 256));
        await interaction.reply({ embeds: [embed] });
        queue.push({ input, interaction } as QueueItem);
    }
);

export const processQueueLoop = async () => {
    do {
        const request = queue.shift();
        if (request) {
            const { input, interaction } = request;
            const embed = new EmbedBuilder()
                .setTitle(input.substring(0, 256))
                .setDescription("Processing...");
            await interaction.editReply({ embeds: [embed] });
            try {
                const response = await conversation.sendMessage(input);
                embed.setDescription(response.substring(0, 4096));
                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                embed.setDescription("Failed");
                await interaction.editReply({ embeds: [embed] });
            }
        } else {
            await delay(1000);
        }
    } while (true);
};
