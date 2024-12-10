// /src/app/api/image/route.ts
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// const prompt = 'Schaetze wie alt diese Person ist.';

export async function POST(req: NextRequest) {
    try {
        const { image, prompt } = await req.json();
        console.log('Received Image Length:', image ? image.length : 'No image provided');
        console.log('Received Prompt:', prompt);

        if (!image) {
            console.log('No image provided, returning 400');
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        const base64Image = image.split(',')[1];
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.log('OpenAI API key is missing, returning 500');
            return NextResponse.json({ error: 'OpenAI API key is not set in environment variables' }, { status: 500 });
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };

        const payload = {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000, // fix to prevent cutting off the response
        };

        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });

        console.log('Response from OpenAI API:', response.data);

        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.error('Error making request to OpenAI API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


