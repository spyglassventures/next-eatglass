

// Anthropics Integration
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '', // Ensure the API key is set in the environment
});

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response('Missing Anthropic API Key.', { status: 400 });
    }

    // Get messages from the request body
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    // Convert messages to a prompt string
    let prompt = '';
    messages.forEach((msg: { role: string; content: string }) => {
      const role = msg.role === 'user' ? 'Human' : 'Assistant';
      prompt += `\n\n${role}: ${msg.content}`;
    });
    prompt += '\n\nAssistant:"""'; // Final prompt for Anthropic's format
    console.log('Generated prompt:', prompt);

    // Call Anthropic API with streaming enabled
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022', // Use a valid, supported model name
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    // Create a ReadableStream to handle the streaming response
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let finalResponse = '';

          stream.on('text', (text: string) => {
            console.log('Streaming chunk:', text); // Log each chunk of text
            finalResponse += text; // Aggregate text
            controller.enqueue(new TextEncoder().encode(text)); // Send text chunk to client
          });

          stream.on('end', () => {
            console.log('Final Response:', finalResponse); // Log the full response
            controller.close();
          });

          stream.on('error', (error) => {
            console.error('Error in streaming response:', error);
            controller.error(error);
          });
        } catch (error) {
          console.error('Streaming setup error:', error);
          controller.error(error);
        }
      },
    });

    // Return the stream to the client
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
