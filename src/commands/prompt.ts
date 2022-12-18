import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import delay from "delay";
import { openai } from "../apis.js";
import { createCommand } from "../utils.js";

type QueueItem = { interaction: ChatInputCommandInteraction; input: string };

const queue: QueueItem[] = [];
export const messages: string[] = [];

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
        const embed = new EmbedBuilder().setTitle(input.substring(0, 256)).setColor("#ffab8a");
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
                .setDescription("Processing...")
                .setColor("#ffab8a");
            await interaction.editReply({ embeds: [embed] });
            if (messages.length >= 10) {
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt:
                        `Concisely Summarize the following conversation:\n` + messages.join("\n"),
                    temperature: 0,
                    max_tokens: 200,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0
                });
                messages.length = 0;
                messages.push(`Context: ${response.data.choices[0].text}`);
            }
            messages.push(`Question: ${input}`);
            try {
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: messages.join("\n"),
                    temperature: 0,
                    max_tokens: 100,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0
                });
                embed.setDescription(response.data.choices[0].text!.substring(0, 4096)).setFooter({
                    text: `untruncated length: ${response.data.choices[0].text?.length}`
                });
                messages.push(`Answer: ${response.data.choices[0].text}`);
                await interaction.editReply({ embeds: [embed] });
            } catch (error: any) {
                messages.push(`Answer: `);
                console.error(error);
                embed.setDescription(error.toString());
                await interaction.editReply({ embeds: [embed] });
            }
        } else {
            await delay(1000);
        }
    } while (true);
};
