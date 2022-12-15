import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import { createCommand } from "../utils.js";
import fetch from "node-fetch";

export default createCommand(
    (builder) =>
        builder
            .setName("music")
            .setDescription("Send a prompt to generate music")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        const embed = new EmbedBuilder().setTitle(input.substring(0, 256)).setColor("#ffab8a");
        await interaction.deferReply();
        try {
            const first = await fetch("https://www.riffusion.com/api/baseten", {
                method: "POST",
                headers: {
                    authority: "www.riffusion.com",
                    accept: "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "text/plain;charset=UTF-8",
                    origin: "https://www.riffusion.com",
                    referer: "https://www.riffusion.com/",
                    "sec-ch-ua": '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "user-agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                },
                body: `{"worklet_input":{"alpha":1,"num_inference_steps":50,"seed_image_id":"og_beat","mask_image_id":null,"start":{"prompt":"${input}","seed":51209,"denoising":0.75,"guidance":7},"end":{"prompt":"${input}","seed":51210,"denoising":0.75,"guidance":7}}}`
            });
            let data: any;
            if (first.size == 0) {
                const response = await fetch("https://www.riffusion.com/api/baseten", {
                    method: "POST",
                    headers: {
                        authority: "www.riffusion.com",
                        accept: "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "text/plain;charset=UTF-8",
                        origin: "https://www.riffusion.com",
                        referer: "https://www.riffusion.com/",
                        "sec-ch-ua":
                            '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "user-agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                    },
                    body: `{"worklet_input":{"alpha":1,"num_inference_steps":50,"seed_image_id":"og_beat","mask_image_id":null,"start":{"prompt":"${input}","seed":51209,"denoising":0.75,"guidance":7},"end":{"prompt":"${input}","seed":51210,"denoising":0.75,"guidance":7}}}`
                });
                data = await response.json();
                let temp = JSON.parse(data.data.worklet_output.model_output);
                temp = temp["audio"].split(",");
                data = Buffer.from(temp[1]);
                console.log(temp);
                data = new AttachmentBuilder(data!, {
                    name: "music.mp3"
                });
            }
            if (!data) {
                embed.setDescription("failed".substring(0, 4096));
                await interaction.editReply({ embeds: [embed] });
            } else {
                embed.setDescription("test");
                await interaction.editReply({ embeds: [embed], files: [data] });
            }
        } catch (error: any) {
            console.error(error);
            embed.setDescription(error.toString());
            await interaction.editReply({ embeds: [embed] });
        }
    }
);
