import { SlashCommandBuilder } from 'discord.js';

const command = {
        command: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Prompt for the bot')
        .addStringOption(option => option.setName('input').setDescription('The prompt')),
    async execute(interaction, api) {
        const value = interaction.options.getString('input');     
        interaction.reply(value)
        const response = await api.sendMessage(
            value
          )
        let output = response.length + value.length > 1980 ? 
        response.substring(0, 2000-value.length-20): 
        response;
        return interaction.editReply("Prompt: " +value+ "\n"+output);
    },
};
export default command
