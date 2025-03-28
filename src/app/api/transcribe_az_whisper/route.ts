// AZ WHISPER 
// This API route handles audio file uploads and sends them to the Azure Whisper API for transcription.
// It lets use a default

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: NextRequest) {
    console.log("✅ Received request to /api/transcribe");

    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

    if (!apiKey || !endpoint || !deployment) {
        console.error("❌ Missing Azure OpenAI configuration:");
        console.error("AZURE_OPENAI_API_KEY:", !!apiKey);
        console.error("AZURE_OPENAI_ENDPOINT:", endpoint);
        console.error("AZURE_OPENAI_DEPLOYMENT:", deployment);
        return NextResponse.json({ error: "Missing Azure OpenAI configuration" }, { status: 500 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof Blob)) {
            console.error("❌ Invalid file upload — no valid Blob found.");
            return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("📦 File received:");
        console.log("  ↳ File size:", buffer.length, "bytes");
        console.log("  ↳ File type:", file.type);
        console.log("  ↳ File name:", (file as File).name || "audio.wav");

        const whisperForm = new FormData();
        whisperForm.append("file", buffer, (file as File).name || "audio.wav");
        whisperForm.append("model", "whisper-1");
        whisperForm.append("language", "de");

        const url = `${endpoint}/openai/deployments/${deployment}/audio/transcriptions?api-version=2023-09-01-preview`;

        console.log("📤 Sending request to Azure OpenAI Whisper endpoint...");
        console.log("  ↳ URL:", url);

        const response = await axios.post(url, whisperForm, {
            headers: {
                "api-key": apiKey,
                ...whisperForm.getHeaders(),
            },
            maxBodyLength: Infinity,
        });

        console.log("✅ Whisper transcription successful.");
        console.log("📝 Transcription result:", JSON.stringify(response.data, null, 2));

        // 👇 Return compatible shape for frontend (DisplayText key!)
        return NextResponse.json({
            DisplayText: response.data.text,
        });
    } catch (error: any) {
        console.error("❌ Whisper transcription failed.");
        if (axios.isAxiosError(error)) {
            console.error("🔍 Axios error message:", error.message);
            if (error.response) {
                console.error("🔍 Azure Whisper response status:", error.response.status);
                console.error("🔍 Azure Whisper response data:", JSON.stringify(error.response.data, null, 2));
            }
        } else {
            console.error("❓ Unknown error:", error);
        }
        return NextResponse.json({ error: "Failed to transcribe audio", details: error.message }, { status: 500 });
    }
}
