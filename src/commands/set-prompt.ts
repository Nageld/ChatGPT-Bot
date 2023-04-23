import { ChatInputCommandInteraction } from "discord.js";
import { openai, promptTokens, historySize, prompt } from "../apis.js";
import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import { messages } from "./prompt.js";




export default createCommand(
    (builder) =>
        builder
            .setName("setprompt")
            .setDescription("Set the prompt for the bot")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        prompt.content = input
        messages[0].content = input
        const embed = createResponseEmbed("The current system message is now:");
            embed.setDescription(input);
        await interaction.reply({ embeds: [embed] });
    }
);

