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
        const inputFormatted = input
            .split("\n")
            .map((x) => x)
            .join("\n");
        const initialEmbed = new EmbedBuilder()
            .setTitle(inputFormatted)
            .setImage("https://i.stack.imgur.com/Fzh0w.png");
        await interaction.reply({ embeds: [initialEmbed] });
        queue.push({ input, interaction } as QueueItem);
    }
);

export const processQueueLoop = async () => {
    do {
        const request = queue.pop();
        if (request) {
            const { input, interaction } = request;
            const inputFormatted = input
                .split("\n")
                .map((x) => x)
                .join("\n");
            const editedEmbed = new EmbedBuilder()
                .setTitle(inputFormatted)
                .setDescription("Processing...")
                .setImage("https://i.stack.imgur.com/Fzh0w.png");
            await interaction.editReply({ embeds: [editedEmbed] });
            try {
                const response = await conversation.sendMessage(input);
                editedEmbed.addFields;
                editedEmbed.setDescription(response.substring(0, 4096));
                await interaction.editReply({ embeds: [editedEmbed] });
            } catch (e) {
                console.log(e);
                editedEmbed.setDescription("Failed");
                await interaction.editReply({ embeds: [editedEmbed] });
            }
        } else {
            await delay(1000);
        }
    } while (true);
};
