import { SlashCommandBuilder } from 'discord.js';
import { api } from '../bot.js';

const prompt = {
    command: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Prompt for the bot')
        .addStringOption(option => option.setName('input').setDescription('The prompt')),
    async execute(interaction) {
        const input = interaction.options.getString('input');
        await interaction.reply(`> ${input}`.substring(0, 2000))
        const response = await api.sendMessage(
            input
        )
        await interaction.editReply(`> ${input}:\n${response}`.substring(0, 2000))
    },
};
export default prompt
