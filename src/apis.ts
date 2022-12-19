import { OpenAIApi, Configuration } from "openai";
import { loadConfig } from "./utils.js";

const config = loadConfig();

export const openai = new OpenAIApi(new Configuration({ apiKey: config.openai }));
export const singleTokens = config.singleTokens;
export const promptTokens = config.promptTokens;
export const historySize = config.historySize;
