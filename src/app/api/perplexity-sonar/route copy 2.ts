import { NextResponse } from 'next/server';

export const runtime = 'edge';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  try {
    if (!PERPLEXITY_API_KEY) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing Perplexity API Key.' }),
        { status: 400 }
      );
    }

    const { messages }: { messages: Message[] } = await req.json();

    // Validate message sequence
    if (messages.length < 2 || messages[0].role !== 'system') {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid message sequence. Must start with a system message.' }),
        { status: 400 }
      );
    }
    for (let i = 1; i < messages.length; i++) {
      if (messages[i].role === messages[i - 1].role) {
        return new NextResponse(
          JSON.stringify({
            error: 'User and assistant roles must alternate in the message sequence.',
          }),
          { status: 400 }
        );
      }
    }

    const body = JSON.stringify({
      model: 'sonar',
      messages,
      stream: true,
    });

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      return new NextResponse(
        JSON.stringify({ error: `Perplexity API Error: ${errorText}` }),
        { status: response.status }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const reader = response.body?.getReader();

        if (!reader) {
          controller.error('Readable stream reader not available.');
          return;
        }

        try {
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Process SSE chunks line by line
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the unfinished line for the next chunk

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonString = line.replace(/^data: /, '').trim();
                if (jsonString) {
                  try {
                    const parsedData = JSON.parse(jsonString);
                    const content = parsedData?.choices?.[0]?.delta?.content || '';
                    controller.enqueue(encoder.encode(content));
                  } catch (error) {
                    console.error('Error parsing JSON:', jsonString, error);
                  }
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error('Error in streaming response:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
