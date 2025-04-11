import { AzureOpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://doc-dialog.openai.azure.com/';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-4o-mini'; // Must match your Azure OpenAI deployment name

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

export async function POST(req: Request) {
  try {
    console.log('POST request received in streaming API route.');

    if (!apiKey) {
      console.error('Missing Azure OpenAI API Key.');
      return new NextResponse(
        JSON.stringify({ error: 'Missing Azure OpenAI API Key.' }),
        { status: 400 }
      );
    }

    // Parse the incoming JSON
    const body = await req.json();
    const { messages, customerName: customerNameFromRequest } = body;
    const customerName = process.env.LOG_USER || customerNameFromRequest || 'Unknown';
    console.log('Parsed request body:', { messages, customerName });

    console.log(`Calling Azure OpenAI API with model deployment \"${deployment}\"...`);

    // Start the Azure OpenAI streaming chat completion
    const openaiResponse = await openai.chat.completions.create({
      model: deployment,  // Required for Azure OpenAI
      messages,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null,
      stream: true, // Enable streaming
    });

    console.log('Received response from Azure OpenAI.');

    const encoder = new TextEncoder();
    let fullResponseText = '';

    // Create a ReadableStream that both sends chunks to the client and accumulates them
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('Starting to process streaming response...');
          for await (const chunk of openaiResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponseText += content;
            console.log('Streaming chunk content:', content);
            controller.enqueue(encoder.encode(content));
          }
          console.log('Streaming complete. Closing controller.');
          controller.close();

          // After streaming is complete, log the request, response, and model to the database
          try {
            const logPayload = {
              customer_name: customerName,
              request: { messages },
              response: `${deployment}, ${fullResponseText}`,
            };

            console.log('Attempting to log request and response:', logPayload);

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
          console.error('Error in processing response:', error);
          controller.error(error);
        }
      },
    });

    console.log('Returning streaming response to client.');
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Server error in streaming API route:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
