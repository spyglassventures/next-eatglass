import { NextResponse } from 'next/server';

export const runtime = 'edge';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';

export async function POST(req: Request) {
  try {
    if (!PERPLEXITY_API_KEY) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing Perplexity API Key.' }),
        { status: 400 }
      );
    }

    const { messages } = await req.json();
    console.log('Received messages:', messages);

    // Adjust and validate the message sequence
    const validMessages = [];
    for (let i = 0; i < messages.length; i++) {
      const current = messages[i];
      const previous = validMessages[validMessages.length - 1];

      // Add the first message unconditionally
      if (i === 0) {
        validMessages.push(current);
        continue;
      }

      // Ensure alternating roles
      if (
        previous.role === 'user' &&
        current.role === 'user'
      ) {
        // Insert a placeholder assistant response
        validMessages.push({
          role: 'assistant',
          content: '', // Placeholder empty response
        });
      }
      validMessages.push(current);
    }

    console.log('Validated and adjusted messages:', validMessages);

    // Prepare the Perplexity API request payload
    const body = JSON.stringify({
      model: 'sonar',
      messages: validMessages,
      max_tokens: 100,
      temperature: 0.2,
      stream: true,
    });

    console.log('Prepared request payload:', body);

    // Send request to Perplexity API
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

    // Create a ReadableStream to handle Perplexity's streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        const reader = response.body?.getReader();

        if (!reader) {
          controller.error('Readable stream reader not available.');
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            console.log('Streaming chunk:', chunk); // Log chunks for debugging
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          console.error('Error in streaming response:', error);
          controller.error(error);
        }
      },
    });

    // Return the streaming response to the client
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
