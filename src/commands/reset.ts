import { chatgpt } from "../apis.js";
import { conversation } from "../apis.js";
import { createCommand } from "../utils.js";

export default createCommand(
    (builder) => builder.setName("reset").setDescription("Reset the bot's knowledge"),
    async (interaction) => {
        var newConversation = chatgpt.getConversation();
        conversation.conversationId = newConversation.conversationId;
        conversation.parentMessageId = newConversation.parentMessageId;
        await interaction.reply("The Eye has forgor.");
    }
);
