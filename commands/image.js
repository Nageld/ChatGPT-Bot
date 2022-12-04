import { SlashCommandBuilder } from 'discord.js';
import { openai } from '../bot.js';

const image = {
        command: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Prompt for the bot')
        .addStringOption(option => option.setName('input').setDescription('The image description')),
    async execute(interaction) {
        const value = interaction.options.getString('input');     
        interaction.reply(value)
        const response = await openai.createImage({
            prompt: value,
            n:1,
            size:"1024x1024"
          });
        let output = response.length + value.length > 1980 ? 
        response.substring(0, 2000-value.length-20): 
        response.data.data[0].url;
        return interaction.editReply("Prompt: " +value+ "\n"+output);
    },
};
export default image