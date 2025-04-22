// ptrascribe az gpt4o transcribe   B A S E
// not fine tuned

// File: pages/api/transcribe_az-gpt-4o-transcribe.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

// export const config = {
//     api: {
//         bodyParser: {
//             sizeLimit: '25mb',
//         },
//     },
// };

export async function POST(req: NextRequest) {
    console.log('Received request to /api/transcribe_az-gpt-4o-transcribe');

    const apiKey = process.env.AZURE_API_KEY_gpt_4o_transcribe;
    const endpoint =
        'https://ai-dm-3309.openai.azure.com/openai/deployments/gpt-4o-transcribe/audio/transcriptions?api-version=2025-03-01-preview';

    if (!apiKey) {
        console.error('Azure OpenAI API key is missing.');
        return NextResponse.json(
            { error: 'Missing Azure OpenAI API key' },
            { status: 500 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!(file instanceof Blob)) {
            console.error('No valid audio file found in request');
            return NextResponse.json(
                { error: 'Invalid file upload' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Build multipart/form-data body
        const form = new FormData();
        form.append('model', 'gpt-4o-transcribe');
        form.append('file', buffer, {
            filename: (file as any).name || 'audio.wav',
            contentType: file.type || 'application/octet-stream',
        });

        console.log('Sending file to Azure OpenAI transcription endpoint...');
        const response = await axios.post(endpoint, form, {
            headers: {
                ...form.getHeaders(),
                'api-key': apiKey,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        console.log('Transcription response:', response.data);

        // Map the Azure field "text" to "DisplayText" for your client
        const transcript = response.data.text ?? response.data?.transcriptionText;
        return NextResponse.json({ DisplayText: transcript });
    } catch (err: unknown) {
        console.error('Transcription error:', err);
        if (err instanceof Error) {
            return NextResponse.json(
                { error: 'Failed to transcribe audio', details: err.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to transcribe audio', details: 'Unknown error' },
            { status: 500 }
        );
    }
}
