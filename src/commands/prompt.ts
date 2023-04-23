import { ChatInputCommandInteraction } from "discord.js";
import delay from "delay";
import { openai, promptTokens, historySize, prompt } from "../apis.js";
import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import { ChatCompletionRequestMessage } from "openai";

type QueueItem = { interaction: ChatInputCommandInteraction; input: string };

const queue: QueueItem[] = [];
export const messages: ChatCompletionRequestMessage[] = [prompt];

export const getPromptResponse = async (prompt: ChatCompletionRequestMessage[]) =>

    await openai.createChatCompletion({
        model: "gpt-4",
        // model: "gpt-3.5-turbo-0301",
        max_tokens: promptTokens * 2,
        messages: prompt,
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
            let temp: ChatCompletionRequestMessage = { "role": "assistant", "content": `Concisely Summarize the following conversation` }
            messages.unshift(temp)
            const response = await getPromptResponse(
                messages
            );
            messages.length = 0;
            messages.push(prompt)
            messages.push({ "role": "assistant", "content": `Context: ${response.data.choices[0].message!.content}` });
        }
        messages.push({ "role": "user", "content": `${input}` });
        try {
            const response = await getPromptResponse(messages);
            const answer = response.data.choices[0].message!.content;
            embed.setDescription(answer.substring(0, 4096)).setFooter({
                text: `Untruncated Length: ${answer.length}`
            });
            messages.push({ "role": "assistant", "content": answer });
        } catch (error: any) {
            console.error(error);
            embed = embedFailure(embed, error.toString());
        } finally {
            await interaction.editReply({ embeds: [embed] });
        }
    } while (true);
};
