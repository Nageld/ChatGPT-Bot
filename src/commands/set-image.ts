import { imageModel } from "../apis.js";
import { createCommand, createResponseEmbed } from "../utils.js";
import { messages } from "./prompt.js";




export default createCommand(
    (builder) =>
        builder
            .setName("setimage")
            .setDescription("Set the default image model for the bot")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The model url")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        imageModel.url = input
        messages[0].content = input
        const embed = createResponseEmbed("The current default image model is:");
            embed.setDescription(input);
        await interaction.reply({ embeds: [embed] });
    }
);

