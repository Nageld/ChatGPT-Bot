import { SlashCommandBuilder } from 'discord.js';

const command = {
        command: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Prompt for the bot')
        .addStringOption(option => option.setName('input').setDescription('The prompt')),
    async execute(interaction, api) {
        interaction.reply("Thinking about it")
        const value = interaction.options.getString('input');        
        const response = await api.sendMessage(
            value
          )
        return interaction.editReply("Prompt: " +value+ "\n"+response);
    },

};
export default command
