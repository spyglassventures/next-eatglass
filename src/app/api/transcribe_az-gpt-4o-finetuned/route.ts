// File: pages/api/transcribe_az-gpt-4o-finetuned.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

// export const config = {
//     api: {
//         // We disable the built‑in JSON/body parser so we can handle FormData
//         bodyParser: false,
//     },
// };

export async function POST(req: NextRequest) {
    console.log('Received request to /api/transcribe_az-gpt-4o-finetuned');

    // ── 1) Load keys & hosts ─────────────────────────────────────────────
    const keyTranscribe = process.env.AZURE_API_KEY_gpt_4o_transcribe!;  // your transcription resource key
    const keyChat = process.env.AZURE_API_KEY_gpt_4o_finetuned!;            // your fine‑tuned chat resource key

    const hostTrans = 'ai-dm-3309.openai.azure.com';
    const hostChat = 'dm-m8szj0bb-northcentralus.openai.azure.com';

    if (!keyTranscribe || !keyChat) {
        console.error('Missing one or both Azure OpenAI API keys.');
        return NextResponse.json(
            { error: 'Missing environment variables for API keys' },
            { status: 500 }
        );
    }

    // ── 2) Build endpoints ──────────────────────────────────────────────
    const transcribeUrl = `https://${hostTrans}/openai/deployments/gpt-4o-transcribe/audio/transcriptions?api-version=2025-03-01-preview`;
    const chatUrl = `https://${hostChat}/openai/deployments/gpt-4o-2024-08-06-ft-c06f7cadcb3e4592b3615f75e90cdeef/chat/completions?api-version=2025-01-01-preview`;

    try {
        // ── 3) Parse the incoming multipart/form-data ─────────────────────
        const formData = await req.formData();
        const fileBlob = formData.get('file');
        if (!(fileBlob instanceof Blob)) {
            console.error('No valid audio file in request');
            return NextResponse.json(
                { error: 'Invalid file upload' },
                { status: 400 }
            );
        }

        // ── 4) Transcribe: audio → raw text ────────────────────────────────
        const audioBuffer = Buffer.from(await fileBlob.arrayBuffer());
        const tf = new FormData();
        tf.append('model', 'gpt-4o-transcribe');
        tf.append('file', audioBuffer, {
            filename: (fileBlob as any).name || 'audio.wav',
            contentType: fileBlob.type || 'application/octet-stream',
        });

        console.log('Calling GPT‑4o‑transcribe on hostTrans…');
        const tResp = await axios.post(transcribeUrl, tf, {
            headers: { ...tf.getHeaders(), 'api-key': keyTranscribe },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });

        const rawText = tResp.data.text;
        console.log('Raw transcription:', rawText);

        // ── 5) Post‑process via YOUR fine‑tuned GPT‑4o chat ───────────────
        const chatPayload = {
            model: 'gpt-4o-2024-08-06-ft-c06f7cadcb3e4592b3615f75e90cdeef',
            messages: [
                {
                    role: 'system', content: `
                    Du bist ein medizinischer Transkriptions‑Editor. Verarbeite den Text und liefere nur die zusammengefassten Kernpunkte in folgendem Format:
                    
                    Aktuelles Problem
                    <kurze Beschreibung>
                    
                    Befunde
                    <Aufzählung der Befunde>
                    
                    Bewertung und Therapie
                    <Empfohlene Therapie & Dosierung>
                    
                    Prozedere
                    <Weitere Schritte>
              
                    ` },
                { role: 'user', content: rawText },
            ],
            max_tokens: 4096,
            temperature: 1,
            top_p: 1,
            stream: false,
        };

        console.log('Calling fine‑tuned GPT‑4o chat endpoint…');
        const cResp = await axios.post(chatUrl, chatPayload, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': keyChat,
            },
        });

        const finalText =
            cResp.data.choices?.[0]?.message?.content ??
            'Keine Transkription erhalten.';

        console.log('Post‑processed transcription:', finalText);

        // ── 6) Return in the same shape your client expects ────────────────
        return NextResponse.json({ DisplayText: finalText });
    } catch (err: any) {
        console.error('Error in combined transcription route:', err);
        return NextResponse.json(
            { error: 'Failed to transcribe and post-process', details: err.message },
            { status: 500 }
        );
    }
}
