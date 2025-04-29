import { NextRequest, NextResponse } from "next/server";

const openAiEndpoint = process.env.OPENAI_ENDPOINT!;
const openAiKey = process.env.OPENAI_API_KEY!;

export async function POST(req: NextRequest) {
    try {
        const { sasUrl } = await req.json();

        if (!sasUrl) {
            return NextResponse.json({ error: "No sasUrl provided" }, { status: 400 });
        }

        const transcriptionResponse = await fetch(`${openAiEndpoint}/openai/deployments/gpt-4o/audio/transcriptions?api-version=2024-02-15-preview`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": openAiKey,
            },
            body: JSON.stringify({
                url: sasUrl,
                response_format: "text",
                language: "de", // or "en" if English
            }),
        });

        if (!transcriptionResponse.ok) {
            const error = await transcriptionResponse.text();
            console.error("Transcription failed:", error);
            return NextResponse.json({ error: "Transcription failed", details: error }, { status: 500 });
        }

        const transcribedText = await transcriptionResponse.text();

        return NextResponse.json({ transcription: transcribedText });

    } catch (error) {
        console.error("Error during transcription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
