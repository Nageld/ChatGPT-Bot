import { ChatGPTAPI } from "chatgpt";
import { OpenAIApi, Configuration } from "openai";
import { loadConfig } from "./utils.js";

const config = loadConfig();

export const openai = new OpenAIApi(new Configuration({ apiKey: config.openai }));
export const chatgpt = new ChatGPTAPI({
    sessionToken: config.chatgpt,
    clearanceToken: config.cloudflare,
    userAgent: config.userAgent
});
export const conversation = chatgpt.getConversation();
