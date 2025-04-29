// ptrascribe az gpt4o transcribe   B A S E with URL now
// not fine tuned

// File: pages/api/transcribe_az-gpt-4o-transcribe-url/route.ts.ts
// File: src/app/api/transcribe_az-gpt-4o-transcribe-url/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(req: NextRequest) {
    console.log('📩 Received request to /api/transcribe_az-gpt-4o-transcribe-url');

    const apiKey = process.env.AZURE_API_KEY_gpt_4o_transcribe;
    const endpoint = 'https://ai-dm-3309.openai.azure.com/openai/deployments/gpt-4o-transcribe/audio/transcriptions?api-version=2025-03-01-preview';

    if (!apiKey) {
        console.error('❌ Azure OpenAI API key is missing.');
        return NextResponse.json({ error: 'Missing Azure OpenAI API key' }, { status: 500 });
    }

    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
        }

        console.log('🌐 Fetching audio from SAS URL...');
        const audioRes = await fetch(url);

        if (!audioRes.ok) {
            throw new Error(`Failed to fetch audio from SAS URL: ${audioRes.statusText}`);
        }

        const contentType = audioRes.headers.get('Content-Type') || 'audio/wav';
        const filename = url.split('/').pop()?.split('?')[0] || 'audiofile';
        const buffer = Buffer.from(await audioRes.arrayBuffer());

        // 🧱 Build form-data
        const form = new FormData();
        form.append('model', 'gpt-4o-transcribe');
        form.append('file', buffer, {
            filename,
            contentType,
        });

        console.log(`📤 Sending audio (${filename}) to Azure OpenAI...`);
        const response = await axios.post(endpoint, form, {
            headers: {
                ...form.getHeaders(),
                'api-key': apiKey,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        const transcript = response.data.text ?? response.data.transcriptionText;

        return NextResponse.json({ DisplayText: transcript || '' });

    } catch (err: unknown) {
        console.error('❌ Transcription error:', err);
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: 'Failed to transcribe audio', details: message }, { status: 500 });
    }
}
