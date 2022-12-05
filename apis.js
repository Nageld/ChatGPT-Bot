import { ChatGPTAPI } from 'chatgpt';
import { OpenAIApi, Configuration } from 'openai';
import config from './config.json' assert { type: 'json' };

export const openai = new OpenAIApi(new Configuration({ apiKey: config.openai }));
export const chatgpt = new ChatGPTAPI({ headless: true })
