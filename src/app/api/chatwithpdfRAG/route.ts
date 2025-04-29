import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, createPartFromUri } from "@google/genai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const prompt = `Antworte auf Deutsch. ${body.prompt}`;
        const urls = body.urls as string[];

        if (!prompt || !urls || urls.length === 0) {
            return NextResponse.json(
                { error: "Prompt and at least one file URL are required." },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const files: any[] = [];

        for (const url of urls) {
            const res = await fetch(url);
            const arrayBuffer = await res.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);

            const fileBlob = new Blob([fileBuffer], { type: "application/pdf" });

            const uploadedFile = await ai.files.upload({
                file: fileBlob,
                config: {
                    displayName: url.split("/").pop() || "file.pdf",
                },
            });

            if (!uploadedFile.name) {
                throw new Error("Uploaded file has no name.");
            }

            let status = await ai.files.get({ name: uploadedFile.name });
            while (status.state === "PROCESSING") {
                console.log(`⏳ Processing ${uploadedFile.name}...`);
                await new Promise((res) => setTimeout(res, 3000));
                status = await ai.files.get({ name: uploadedFile.name });
            }

            if (status.state === "FAILED") {
                throw new Error(`File ${uploadedFile.name} processing failed.`);
            }

            if (status.uri && status.mimeType) {
                files.push(createPartFromUri(status.uri, status.mimeType));
            }
        }

        // ✅ FINAL STEP: send to Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [prompt, ...files],
        });

        return NextResponse.json({ answer: response.text });

    } catch (error: any) {
        console.error("❌ Fehler bei Gemini-Anfrage:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
