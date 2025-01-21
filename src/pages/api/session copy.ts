import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "coral",
                modalities: ["text", "audio"], // Include both text and audio if needed
                instructions: "Du bist ein freundlicher Assistent.",
                input_audio_transcription: {
                    model: "whisper-1",
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create session: ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
