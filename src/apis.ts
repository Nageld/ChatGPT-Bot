import { OpenAIApi, Configuration, ChatCompletionRequestMessage } from "openai";
import { loadConfig } from "./utils.js";

const config = loadConfig();

export const openai = new OpenAIApi(new Configuration({ apiKey: config.openai }));
export const singleTokens = config.singleTokens;
export const promptTokens = config.promptTokens;
export const historySize = config.historySize;
export const huggingfaceKey = config.huggingface;
export const prompt: ChatCompletionRequestMessage = {"role": "system", "content": "You are a discord bot that answers questions"};
export const imageModel = {url: "https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora"}
