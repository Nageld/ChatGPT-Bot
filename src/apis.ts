import { OpenAIApi, Configuration } from "openai";
import { loadConfig } from "./utils.js";

const config = loadConfig();

export const openai = new OpenAIApi(new Configuration({ apiKey: config.openai }));
