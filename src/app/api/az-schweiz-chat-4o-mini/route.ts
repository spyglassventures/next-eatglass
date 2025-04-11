import { AzureOpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://doc-dialog.openai.azure.com/';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-4o-mini';

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export async function POST(req: Request) {
  try {
    console.log('📨 POST request received in streaming API route.');

    if (!apiKey) {
      console.error('❌ Missing Azure OpenAI API Key.');
      return new NextResponse(JSON.stringify({ error: 'Missing Azure OpenAI API Key.' }), {
        status: 400,
      });
    }

    const body = await req.json();
    const { messages, customerName: customerNameFromRequest } = body;
    const customerName = process.env.LOG_USER || customerNameFromRequest || 'Unknown';

    console.log('🔍 Parsed request body:', { customerName, messages });

    const openaiResponse = await openai.chat.completions.create({
      model: deployment,
      messages,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null,
      stream: true,
    });

    const encoder = new TextEncoder();
    let fullResponseText = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of openaiResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponseText += content;
            controller.enqueue(encoder.encode(content));
          }
          controller.close();
        } catch (err) {
          console.error('❌ Stream error:', err);
          controller.error(err);
        }
      },
    });

    // 🚀 Return response early to start the stream
    const response = new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    });

    // ✅ After starting the stream, fire and await the log OUTSIDE
    (async () => {
      try {
        const baseUrl = process.env.BASE_URL || 'https://next-eatglass.vercel.app';
        const logPayload = {
          customer_name: customerName,
          request: { messages },
          response: `${deployment}, ${fullResponseText}`,
        };

        console.log('📝 Sending log after stream started:', logPayload);

        const res = await fetch(`${baseUrl}/api/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logPayload),
        });

        const resText = await res.text();
        console.log(`📦 /api/log response: ${res.status} – ${resText}`);
      } catch (err: any) {
        console.error('❌ Failed to send log:', err.message || err);
      }
    })();

    return response;
  } catch (error: any) {
    console.error('❌ Top-level error in API route:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
    });
  }
}
