// gpt-3.5-turbo'



// 4o
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse(JSON.stringify({ error: 'Missing OpenAI API Key.' }), { status: 400 });
    }

    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    });

    const encoder = new TextEncoder();

    // Create a ReadableStream to handle chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(content));
          }
          controller.close();
        } catch (error) {
          console.error('Error in streaming response:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
