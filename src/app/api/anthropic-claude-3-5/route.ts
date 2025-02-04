import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '', // Ensure the API key is set in the environment
});

export async function POST(req: Request) {
  try {
    console.log('Anthropic POST request received.');

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing Anthropic API Key.');
      return new Response('Missing Anthropic API Key.', { status: 400 });
    }

    // Parse the request body and optionally extract a customer name.
    const body = await req.json();
    const { messages, customerName: customerNameFromRequest } = body;
    const customerName = process.env.LOG_USER || customerNameFromRequest || 'Unknown';
    console.log('Received messages:', messages);
    console.log('Customer name:', customerName);

    // Convert messages to a prompt string
    let prompt = '';
    messages.forEach((msg: { role: string; content: string }) => {
      const role = msg.role === 'user' ? 'Human' : 'Assistant';
      prompt += `\n\n${role}: ${msg.content}`;
    });
    prompt += '\n\nAssistant:"""'; // Final prompt for Anthropic's format
    console.log('Generated prompt:', prompt);

    // Define the model and call the Anthropic API with streaming enabled
    const model = 'claude-3-5-sonnet-20241022';
    console.log(`Calling Anthropic API with model "${model}"...`);
    const stream = await anthropic.messages.stream({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    console.log('Anthropic API stream initiated.');

    // Create a ReadableStream to handle the streaming response
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let finalResponse = '';
          console.log('Starting to process streaming response...');

          stream.on('text', (text: string) => {
            console.log('Streaming chunk received:', text);
            finalResponse += text; // Aggregate text
            controller.enqueue(new TextEncoder().encode(text));
          });

          stream.on('end', async () => {
            console.log('Streaming ended.');
            console.log('Final Response:', finalResponse);
            controller.close();

            // After the stream is finished, log the request and complete response to the database
            try {
              const logPayload = {
                customer_name: customerName,
                model, // include the model dynamically
                request: prompt,
                response: `${model}, ${finalResponse}`,
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
          });

          stream.on('error', (error: any) => {
            console.error('Error in streaming response:', error);
            controller.error(error);
          });
        } catch (error) {
          console.error('Streaming setup error:', error);
          controller.error(error);
        }
      },
    });

    console.log('Returning streaming response to client.');
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
