import { SlashCommandBuilder } from 'discord.js';
import { chatgpt } from '../bot';
import delay from 'delay'

const prompt = {
    command: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Prompt for the bot')
        .addStringOption(option => option.setName('input').setDescription('The prompt')),
    async execute(interaction) {
        const input = interaction.options.getString('input');
        await interaction.reply(`> ${input}`.substring(0, 2000))
        queue.push({ input, interaction })
    },
};
export default prompt



const queue = []
export async function processQueueLoop() {
    do {
        const request = queue.pop()
        if (request) {
            const { input, interaction } = request
            await interaction.editReply(`> ${input}\nProcessing...`.substring(0, 2000))
            const response = await chatgpt.sendMessage(input)
            await interaction.editReply(`> ${input}\n${response}`.substring(0, 2000))
        } else {
            await delay(1000)
        }
    } while (true)
}
