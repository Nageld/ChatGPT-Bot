import { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import delay from "delay";
import { openai, promptTokens, historySize, prompt } from "../apis.js";
import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import { OpenAI } from "openai";
import { Builder } from "../types.js";

interface QueueItem {
    interaction: ChatInputCommandInteraction;
    input: string;
}

const queue: QueueItem[] = [];
export const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [prompt];

export const getPromptResponse = async (prompt: OpenAI.Chat.ChatCompletionMessageParam[]) =>
    await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: promptTokens * 2,
        messages: prompt
    });

export default createCommand(
    (builder: Builder) =>
        builder
            .setName("prompt")
            .setDescription("Prompt for the bot")
            .addStringOption((option: SlashCommandStringOption) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input");
        const embed = createResponseEmbed(input ?? "");
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
            const temporary: OpenAI.Chat.ChatCompletionMessageParam = {
                role: "assistant",
                content: `Concisely Summarize the following conversation`,
                refusal: undefined
            };
            messages.unshift(temporary);
            const response = await getPromptResponse(messages);
            messages.length = 0;
            messages.push(prompt, {
                role: "assistant",
                content: `Context: ${response.choices[0].message.content ?? ""}`,
                refusal: undefined
            });
        }
        messages.push({ role: "user", content: input });
        try {
            const response = await getPromptResponse(messages);
            const answer = response.choices[0].message.content ?? "failed";
            embed.setDescription(answer.slice(0, 4096)).setFooter({
                text: `Untruncated Length: ${answer.length.toString()}`
            });
            messages.push({ role: "assistant", content: answer });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                embed = embedFailure(embed, error.toString());
            }
        } finally {
            await interaction.editReply({ embeds: [embed] });
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
    } while (true);
};
