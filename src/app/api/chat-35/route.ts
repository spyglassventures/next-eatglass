import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    console.log('POST request received in streaming API route.');

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OpenAI API Key.');
      return new NextResponse(
        JSON.stringify({ error: 'Missing OpenAI API Key.' }),
        { status: 400 }
      );
    }

    // Parse the incoming JSON
    const body = await req.json();
    const { messages, customerName: customerNameFromRequest } = body;
    const customerName = process.env.LOG_USER || customerNameFromRequest || 'Unknown';
    console.log('Parsed request body:', { messages, customerName });

    // Define the model dynamically
    const model = 'gpt-3.5-turbo';
    console.log(`Calling OpenAI API with model "${model}"...`);

    // Start the OpenAI streaming chat completion
    const openaiResponse = await openai.chat.completions.create({
      model,
      stream: true,
      messages,
    });
    console.log('Received streaming response from OpenAI.');

    const encoder = new TextEncoder();
    let fullResponseText = '';

    // Create a ReadableStream that both sends chunks to the client and accumulates them
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('Starting to process streaming response...');
          for await (const chunk of openaiResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponseText += content; // accumulate the content for later logging
            console.log('Streaming chunk content:', content);
            controller.enqueue(encoder.encode(content));
          }
          console.log('Streaming complete. Closing controller.');
          controller.close();

          // After streaming is complete, log the request, response, and model to the database
          try {
            // Concatenate the model and full response text in the logged response field
            const logPayload = {
              customer_name: customerName,
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
        } catch (error) {
          console.error('Error in streaming response:', error);
          controller.error(error);
        }
      },
    });

    console.log('Returning streaming response to client.');
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  } catch (error: any) {
    console.error('Server error in streaming API route:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

