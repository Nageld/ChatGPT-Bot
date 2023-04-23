import { OpenAIApi, Configuration, ChatCompletionRequestMessage } from "openai";
import { loadConfig } from "./utils.js";

const config = loadConfig();

export const openai = new OpenAIApi(new Configuration({ apiKey: config.openai }));
export const singleTokens = config.singleTokens;
export const promptTokens = config.promptTokens;
export const historySize = config.historySize;
export const prompt: ChatCompletionRequestMessage = {"role": "system", "content": "You are a discord bot that answers questions"};
