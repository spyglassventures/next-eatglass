import { NextResponse } from 'next/server';

export const runtime = 'edge';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  try {
    console.log('POST request received for Perplexity API proxy.');

    if (!PERPLEXITY_API_KEY) {
      console.error('Missing Perplexity API Key.');
      return new NextResponse(
        JSON.stringify({ error: 'Missing Perplexity API Key.' }),
        { status: 400 }
      );
    }

    // Parse request body and extract customerName if provided.
    const body = await req.json();
    const { messages, customerName: customerNameFromRequest } = body;
    const customerName = process.env.LOG_USER || customerNameFromRequest || 'Unknown';
    console.log('Parsed messages:', messages);
    console.log('Customer name:', customerName);

    // Define the model as a constant.
    const model = 'sonar';

    // Build the outgoing request payload.
    const bodyString = JSON.stringify({
      model,
      messages,
      stream: true,
    });
    console.log('Outgoing request body to Perplexity API:', bodyString);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: bodyString,
    });
    console.log('Perplexity API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      return new NextResponse(
        JSON.stringify({ error: `Perplexity API Error: ${errorText}` }),
        { status: response.status }
      );
    }

    // Create a ReadableStream to process the streaming response.
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const reader = response.body?.getReader();

        if (!reader) {
          console.error('Readable stream reader not available.');
          controller.error('Readable stream reader not available.');
          return;
        }

        let buffer = '';
        let citations: string[] = [];
        let fullResponseText = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log('Stream reading completed.');
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            console.log('Received chunk:', chunk);
            buffer += chunk;

            // Process lines from the buffer.
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              console.log('Processing line:', line);
              if (line.startsWith('data: ')) {
                const jsonString = line.replace(/^data: /, '').trim();
                if (jsonString) {
                  try {
                    const parsedData = JSON.parse(jsonString);
                    console.log('Parsed data:', parsedData);

                    // Extract citations if present.
                    if (parsedData.citations) {
                      citations = parsedData.citations;
                      console.log('Extracted citations:', citations);
                    }

                    // Extract content from the parsed data.
                    const content = parsedData?.choices?.[0]?.delta?.content || '';
                    if (content) {
                      // Append citations as links.
                      let updatedContent = content;
                      citations.forEach((citation, index) => {
                        const reference = `[${index + 1}]`;
                        const link = `<a href="${citation}" target="_blank" rel="noopener noreferrer">${reference}</a>`;
                        updatedContent = updatedContent.replace(reference, link);
                      });
                      console.log('Enqueuing content:', updatedContent);
                      controller.enqueue(encoder.encode(updatedContent));
                      fullResponseText += updatedContent;
                    }
                  } catch (error) {
                    console.error('Error parsing JSON from line:', jsonString, error);
                  }
                }
              }
            }
          }

          // Log the full accumulated response.
          console.log('Final full response:', fullResponseText);

          // Log the request and complete response to the internal logging endpoint.
          try {
            const logPayload = {
              customer_name: customerName,
              model, // model is dynamically included
              request: { messages },
              response: `${model}, ${fullResponseText}`,
            };

            console.log('Attempting to log request and response:', logPayload);

            // Use an absolute URL for internal fetch. Adjust BASE_URL if needed.
            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
            await fetch(`${baseUrl}/api/log`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(logPayload),
            });
            console.log('Successfully logged request and response.');
          } catch (logError) {
            console.error('Error logging request and response:', logError);
          }

          controller.close();
          console.log('Controller closed after stream completion.');
        } catch (error) {
          console.error('Error in streaming response:', error);
          controller.error(error);
        }
      },
    });

    console.log('Returning streaming response.');
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
