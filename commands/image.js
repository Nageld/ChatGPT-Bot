import { SlashCommandBuilder } from 'discord.js';

const image = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Prompt for the bot')
        .addStringOption(option => option.setName('input').setDescription('The image description')),
    async execute(interaction, openai, chatgpt) {
        const input = interaction.options.getString('input');
        await interaction.reply(`> ${input}`.substring(0, 2000))
        const response = await openai.createImage({
            prompt: input,
            n: 1,
            size: "1024x1024"
        });
        await interaction.editReply(`> ${input}\n${response.data.data[0].url}`.substring(0, 2000))
    },
};
export default image