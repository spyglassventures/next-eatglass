import { AzureOpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://doc-dialog.openai.azure.com/';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-4o-mini';

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export async function POST(req: Request) {
  try {
    console.log('📨 POST request received.');

    if (!apiKey) {
      console.error('❌ Missing API key.');
      return new NextResponse('Missing API key', { status: 400 });
    }

    const body = await req.json();
    const { messages, customerName: customerNameFromRequest } = body;
    const customerName = process.env.LOG_USER || customerNameFromRequest || 'Unknown';

    const openaiResponse = await openai.chat.completions.create({
      model: deployment,
      messages,
      stream: true,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const stream = OpenAIStream(openaiResponse as any);

    // Tap into the OpenAIStream to accumulate real text content
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    let accumulatedResponse = '';
    const reader = stream.getReader();

    const processChunk = ({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
      if (done) {
        writer.close();

        (async () => {
          try {
            const baseUrl = process.env.BASE_URL || 'https://next-eatglass.vercel.app';
            const logPayload = {
              customer_name: customerName,
              request: { messages },
              response: `${deployment}, ${accumulatedResponse}`,
            };

            const res = await fetch(`${baseUrl}/api/log`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(logPayload),
            });

            const resText = await res.text();
            console.log(`📦 Log response: ${res.status} – ${resText}`);
          } catch (err: any) {
            console.error('❌ Failed to send log:', err.message || err);
          }
        })();

        return;
      }

      const chunk = decoder.decode(value, { stream: true });

      // Extract actual content from SSE line (like: data: {...})
      const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

      for (const line of lines) {
        const jsonStr = line.replace(/^data: /, '').trim();
        if (jsonStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed?.choices?.[0]?.delta?.content;
          if (content) {
            accumulatedResponse += content;
          }
        } catch (e) {
          console.warn('🔍 Could not parse SSE chunk:', line);
        }
      }

      writer.write(encoder.encode(chunk));
      return reader.read().then(processChunk);
    };

    reader.read().then(processChunk);

    return new StreamingTextResponse(readable);
  } catch (err: any) {
    console.error('❌ Top-level error:', err.message || err);
    return new NextResponse(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
    });
  }
}
