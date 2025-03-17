import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    console.log("Received request to /api/transcribe");

    if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
        console.error("Azure Speech API key or region is missing.");
        return NextResponse.json({ error: "Missing Azure Speech API credentials" }, { status: 500 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof Blob)) {
            console.error("No valid audio file found in request");
            return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
        }

        // Convert file to Buffer for sending
        const buffer = Buffer.from(await file.arrayBuffer());

        console.log("Sending file to Azure AI Speech API...");

        // Azure Speech API endpoint
        const azureUrl = `https://${process.env.AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=de-DE`;

        const response = await axios.post(azureUrl, buffer, {
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
                "Content-Type": "audio/wav",
            },
        });

        console.log("Azure Speech API Response:", response.data);
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Azure Speech API Error:", error.message);
            return NextResponse.json({ error: "Failed to transcribe audio", details: error.message }, { status: 500 });
        }
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Failed to transcribe audio", details: "Unknown error" }, { status: 500 });
    }
}
