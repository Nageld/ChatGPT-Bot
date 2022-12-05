import { SlashCommandBuilder } from 'discord.js';
import { chatgpt } from '../apis.js';

const reset = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset the bots knowledge'),
    async execute(interaction) {
        await chatgpt.close()
        await chatgpt.init()
        await interaction.reply("The Eye has forgotten.");
    },
};
export default reset
