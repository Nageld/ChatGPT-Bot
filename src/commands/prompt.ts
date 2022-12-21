import { ChatInputCommandInteraction } from "discord.js";
import delay from "delay";
import { openai, promptTokens, historySize } from "../apis.js";
import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";

type QueueItem = { interaction: ChatInputCommandInteraction; input: string };

const queue: QueueItem[] = [];
export const messages: string[] = [];

export const getPromptResponse = async (prompt: string) =>
    await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
        max_tokens: promptTokens * 2,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    });

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
        const embed = createResponseEmbed(input);
        await interaction.reply({ embeds: [embed] });
        queue.push({ input, interaction } as QueueItem);
    }
);

export const processQueueLoop = async () => {
    do {
        const request = queue.shift();
        if (!request) {
            await delay(1000);
            continue;
        }

        const { input, interaction } = request;
        let embed = createResponseEmbed(input).setDescription("Processing...");
        await interaction.editReply({ embeds: [embed] });
        if (messages.length >= historySize) {
            const response = await getPromptResponse(
                `Concisely Summarize the following conversation:\n` + messages.join("\n")
            );
            messages.length = 0;
            messages.push(`Context: ${response.data.choices[0].text}`);
        }
        messages.push(`Question: ${input}`);
        try {
            const response = await getPromptResponse(messages.join("\n"));
            const answer = response.data.choices[0].text!;
            embed.setDescription(answer.substring(0, 4096)).setFooter({
                text: `Untruncated Length: ${answer.length}}`
            });
            messages.push(answer);
        } catch (error: any) {
            messages.push(`Answer: `);
            console.error(error);
            embed = embedFailure(embed, error.toString());
        } finally {
            await interaction.editReply({ embeds: [embed] });
        }
    } while (true);
};
