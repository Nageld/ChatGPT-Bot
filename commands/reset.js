import { SlashCommandBuilder } from 'discord.js';
import { chatgpt } from '../bot'

const reset = {
    command: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset the bots knowledge'),
    async execute(interaction) {
        await chatgpt.close()
        await chatgpt.init()
        await interaction.reply("The Eye has forgotten.");
    },
};
export default reset
