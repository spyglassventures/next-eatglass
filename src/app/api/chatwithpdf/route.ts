import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const prompt = `Antworte auf Deutsch. ${formData.get("prompt") as string}`;

    if (!prompt) {
        return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }
    if (!file) {
        return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    // Create a temporary file path
    const tempDir = "/tmp"; // or any appropriate temporary directory
    const tempPath = path.join(tempDir, file.name);

    // Instead of Buffer.from, create a Uint8Array from the file's arrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    fs.writeFileSync(tempPath, uint8Array);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

    // Upload file using its file path
    const uploadResult = await fileManager.uploadFile(tempPath, {
        mimeType: file.type,
        displayName: file.name,
    });

    // newest
    // const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro-preview-03-25" });

    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

    // Generate response to user's prompt
    const result = await model.generateContent([
        {
            fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
            },
        },
        prompt,
    ]);

    // Cleanup: delete the file from the file manager and local disk if needed
    await fileManager.deleteFile(uploadResult.file.name);
    fs.unlinkSync(tempPath); // remove temporary file

    return NextResponse.json({ answer: result.response.text() });
}
