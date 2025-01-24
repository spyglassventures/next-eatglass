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

        let buffer = '';
        let citations: string[] = [];

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Process lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonString = line.replace(/^data: /, '').trim();
                if (jsonString) {
                  try {
                    const parsedData = JSON.parse(jsonString);

                    // Extract citations
                    if (parsedData.citations) {
                      citations = parsedData.citations;
                    }

                    // Extract content
                    const content = parsedData?.choices?.[0]?.delta?.content || '';
                    if (content) {
                      // Append citations as links
                      let updatedContent = content;

                      citations.forEach((citation, index) => {
                        const reference = `[${index + 1}]`;
                        const link = `<a href="${citation}" target="_blank" rel="noopener noreferrer">${reference}</a>`;
                        updatedContent = updatedContent.replace(reference, link);
                      });

                      controller.enqueue(encoder.encode(updatedContent));
                    }
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
