import { ChatInputCommandInteraction } from "discord.js";
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
            .map((x) => `> ${x}`)
            .join("\n");
        await interaction.reply(inputFormatted.substring(0, 2000));
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
                .map((x) => `> ${x}`)
                .join("\n");
            await interaction.editReply(`${inputFormatted}\nProcessing...`.substring(0, 2000));
            const response = await conversation.sendMessage(input);
            await interaction.editReply(`${inputFormatted}\n${response}`.substring(0, 2000));
        } else {
            await delay(1000);
        }
    } while (true);
};