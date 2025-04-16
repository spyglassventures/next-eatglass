// /app/api/chatwithpdf/upload-file.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export const config = {
    api: {
        bodyParser: false,
    }
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
        }

        const tempPath = `/tmp/${file.name}`;
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
    } catch (err) {
        console.error("❌ Upload error:", err);
        return NextResponse.json({ error: "File upload failed." }, { status: 500 });
    }
}
