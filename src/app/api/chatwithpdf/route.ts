import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const step = formData.get("step") as string;

    // Optional timeout safety in case Gemini hangs
    const timeout = 55000; // 55 seconds (Vercel limit is ~60s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (step === "upload") {
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        const tempPath = path.join("/tmp", file.name);
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        fs.writeFileSync(tempPath, uint8Array);

        const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
        const uploaded = await fileManager.uploadFile(tempPath, {
            mimeType: file.type,
            displayName: file.name,
        });

        fs.unlinkSync(tempPath); // Clean up temp file

        return NextResponse.json({
            uploadStatus: "ok",
            fileUri: uploaded.file.uri,
            mimeType: uploaded.file.mimeType,
        });
    }

    // Step 2: analyze
    if (step === "analyze") {
        const fileUri = formData.get("fileUri") as string;
        const mimeType = formData.get("mimeType") as string;
        const prompt = `Antworte auf Deutsch. ${formData.get("prompt") as string}`;

        if (!prompt || !fileUri || !mimeType) {
            return NextResponse.json({ error: "Missing fields." }, { status: 400 });
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
            const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro-preview-03-25" });

            const result = await model.generateContent([
                {
                    fileData: {
                        fileUri,
                        mimeType,
                    },
                },
                prompt,
            ]);

            return NextResponse.json({ answer: result.response.text() });
        } catch (error: any) {
            console.error("❌ Gemini API error:", error);
            return NextResponse.json({ error: "AI processing failed." }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
}
