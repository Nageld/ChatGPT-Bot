import { OpenAI } from "openai";
import { loadConfig } from "./utilities.js";

const config = loadConfig();

export const openai = new OpenAI({
    apiKey: config.openai
});
export const singleTokens = config.singleTokens;
export const promptTokens = config.promptTokens;
export const historySize = config.historySize;
export const huggingfaceKey = config.huggingface;
export const prompt: OpenAI.Chat.ChatCompletionMessageParam = {
    role: "assistant",
    content: "You are a discord bot that answers questions",
    refusal: "failed"
};
export const imageModel = {
    url: "https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora"
};
