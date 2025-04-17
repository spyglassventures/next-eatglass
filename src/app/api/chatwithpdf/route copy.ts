import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const prompt = `Antworte auf Deutsch. ${formData.get("prompt") as string}`;

    if (!prompt) {
        return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
        return NextResponse.json({ error: "At least one file is required." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

    const tempDir = "/tmp";
    const uploadedFiles: { uri: string; mimeType: string; name: string }[] = [];

    try {
        // Upload all files
        for (const file of files) {
            const tempPath = path.join(tempDir, file.name);
            const buffer = new Uint8Array(await file.arrayBuffer());
            fs.writeFileSync(tempPath, buffer);

            const uploadResult = await fileManager.uploadFile(tempPath, {
                mimeType: file.type,
                displayName: file.name,
            });

            uploadedFiles.push({
                uri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
                name: uploadResult.file.name,
            });

            fs.unlinkSync(tempPath);
        }

        // Prepare the prompt + files
        const contents: any[] = [{ text: prompt }];
        for (const file of uploadedFiles) {
            contents.push({
                fileData: {
                    fileUri: file.uri,
                    mimeType: file.mimeType,
                },
            });
        }

        // Generate the response
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
        const result = await model.generateContent(contents);

        // Clean up uploaded files from Gemini
        for (const file of uploadedFiles) {
            await fileManager.deleteFile(file.name);
        }

        return NextResponse.json({ answer: result.response.text() });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
