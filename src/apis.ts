import { ChatGPTAPI } from "chatgpt";
import { OpenAIApi, Configuration } from "openai";
import { loadConfig } from "./utils.js";

const config = await loadConfig();

export const openai = new OpenAIApi(new Configuration({ apiKey: config.openai }));
export const chatgpt = new ChatGPTAPI({ headless: true });
