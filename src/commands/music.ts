import { AttachmentBuilder } from "discord.js";
import { createCommand, createResponseEmbed, embedFailure } from "../utils.js";
import fetch from "node-fetch";

type RiffusionResponse = {
    data: {
        worklet_output: {
            model_output: string;
        };
    };
};

const createFetchOptions = (seed: string, input: string, tempo: string) => ({
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
    body: `{"worklet_input":{"alpha":1,"num_inference_steps":50,"seed_image_id":"${seed}","mask_image_id":null,"start":{"prompt":"${input}","seed":0,"denoising":${tempo},"guidance":7},"end":{"prompt":"${input}","seed":1,"denoising":${tempo},"guidance":7}}}`
});

const getResult = async (
    input: string,
    seed: string,
    tempo: string,
    retry = true
): Promise<AttachmentBuilder | null> => {
    const res = await fetch(
        "https://www.riffusion.com/api/baseten",
        createFetchOptions(seed, input, tempo)
    );
    if (res && res.size !== 0) {
        const data = (await res.json()) as RiffusionResponse;
        const dataNoHeader = JSON.parse(data.data.worklet_output.model_output)["audio"].split(",");
        const byteStream = Buffer.from(dataNoHeader[1], "base64");
        return new AttachmentBuilder(byteStream, {
            name: `${input}-${seed}.mp3`
        });
    } else if (retry) {
        return await getResult(input, seed, tempo, false);
    } else {
        return null;
    }
};

export default createCommand(
    (builder) =>
        builder
            .setName("music")
            .setDescription("Send a prompt to generate music")
            .addStringOption((option) =>
                option.setName("input").setRequired(true).setDescription("The prompt")
            )
            .addStringOption((option) =>
                option
                    .setName("seed")
                    .setRequired(false)
                    .setDescription("The seed image")
                    .addChoices({ name: "og_beat", value: "og_beat" })
                    .addChoices({ name: "agile", value: "agile" })
                    .addChoices({ name: "marim", value: "marim" })
                    .addChoices({ name: "motorway", value: "motorway" })
                    .addChoices({ name: "vibes", value: "vibes" })
            )
            .addStringOption((option) =>
                option
                    .setName("denoise")
                    .setRequired(false)
                    .setDescription("The tempo (Enter a decimal please)")
            ),
    async (interaction) => {
        const input = interaction.options.getString("input")!;
        const seed = interaction.options.getString("seed")?.toLowerCase() ?? "og_beat";
        const denoise = interaction.options.getString("denoise") ?? ".75";
        let embed = createResponseEmbed(input);
        await interaction.deferReply();
        try {
            const tempo = parseFloat(denoise).toString();
            const result = await getResult(input, seed, tempo);
            if (result === null) {
                embedFailure(embed);
                await interaction.editReply({ embeds: [embed] });
            } else {
                embed.setDescription("Sent");
                await interaction.editReply({ files: [result] });
            }
        } catch (error: any) {
            console.error(error);
            embed = embedFailure(embed, error.toString());
            await interaction.editReply({ embeds: [embed] });
        }
    }
);
