import { SlashCommandBuilder } from 'discord.js';
import { api } from '../bot.js'

const reset = {
    command: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset the bots knowledge'),
    async execute(interaction) {
        await api.close()
        await api.init()
        await interaction.reply("The Eye has forgotten.");
    },
};
export default reset
