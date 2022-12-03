import { SlashCommandBuilder } from 'discord.js';


const reset = {
        command: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset the bots knowledge'),
    async execute(interaction, api) {
        await api.close()
        return interaction.reply("The eye has forgotten");
    },
};
export default reset
