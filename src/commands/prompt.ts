import { ChatInputCommandInteraction } from "discord.js";
import delay from "delay";
import { chatgpt } from "../apis.js";
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
        await interaction.reply(`> ${input}`.substring(0, 2000));
        queue.push({ input, interaction } as QueueItem);
    }
);

export const processQueueLoop = async () => {
    do {
        const request = queue.pop();
        if (request) {
            const { input, interaction } = request;
            await interaction.editReply(`> ${input}\nProcessing...`.substring(0, 2000));
            const response = await chatgpt.sendMessage(input);
            await interaction.editReply(`> ${input}\n${response}`.substring(0, 2000));
        } else {
            await delay(1000);
        }
    } while (true);
};
