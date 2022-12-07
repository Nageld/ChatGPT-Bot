# ChatGPT-Bot
![Do da stanky leg](https://img.shields.io/static/v1?label=do%20da&message=stanky%20leg&color=purple&style=for-the-badge)


A Discord bot that connects to Chat-GPT to provide conversations with the model via Discord. It also allows for image generation through DALL-E.

## Usage

To run an instance of this bot, you'll need to first clone the repository:

```
git clone https://github.com/Nageld/ChatGPT-Bot
```

Then install dependencies through pnpm:

```
pnpm install
```

### config.json

Now that the bot is setup, you need to configure it. Create a new file called `config.json` at the root of the repo and check out [config.schema.json](https://github.com/Nageld/ChatGPT-Bot/blob/main/config.schema.json) for how to propogate it.

### Running the bot

To run the bot run:

```
pnpm deploy-cmd
pnpm start
```

`pnpm deploy-cmd` is only required the first run and will only need to run again if you pull an update.

### Commands

- `/prompt` Sends a prompt to Chat-GPT
- `/image` Generates an image through DALL-E based on the given prompt
- `/reset` Resets the current conversation with Chat-GPT


