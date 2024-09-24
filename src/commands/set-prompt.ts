import { prompt } from "../apis.js";
import { createCommand, createResponseEmbed } from "../utils.js";
import { messages } from "./prompt.js";

export default createCommand(
    (builder: any) =>
        builder
            .setName("setprompt")
            .setDescription("Set the prompt for the bot")
            .addStringOption((option: any) =>
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

