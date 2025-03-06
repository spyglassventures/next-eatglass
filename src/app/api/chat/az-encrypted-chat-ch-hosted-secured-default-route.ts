import { AzureOpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://doc-dialog.openai.azure.com/';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-4o-mini'; // Must match your Azure OpenAI deployment name

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

async function logRequestAndResponse(request: any, response: any, baseUrl: string) {
  const customerName = process.env.LOG_USER || 'Unknown';

  try {
    await fetch(`${baseUrl}/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_name: customerName,
        request,
        response
      })
    });
  } catch (error) {
    console.error('Error logging request and response:', error);
  }
}

export async function POST(req: Request) {
  try {
    console.log('POST request received in Azure OpenAI streaming API route.');

    if (!apiKey) {
      console.error('Missing Azure OpenAI API Key.');
      return new NextResponse('Missing Azure OpenAI API Key.', { status: 400 });
    }

    // Parse request JSON
    const { messages } = await req.json();

    console.log(`Calling Azure OpenAI API with model deployment \"${deployment}\"...`);

    // Azure OpenAI streaming chat completion
    const response = await openai.chat.completions.create({
      model: deployment, // Azure requires deployment name instead of model
      stream: true,
      messages
    });

    console.log('Received response from Azure OpenAI.');

    const stream = OpenAIStream(response as any);

    // Create a TransformStream to accumulate the response
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let accumulatedResponse = '';

    // Read from the OpenAI stream and write to the TransformStream
    const reader = stream.getReader();

    reader.read().then(function processText({ done, value }) {
      if (done) {
        // Log request and complete response asynchronously
        const protocol = req.headers.get('x-forwarded-proto') || 'https';
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
        const baseUrl = `${protocol}://${host}`;

        // Remove unwanted characters from the accumulated response
        const filteredResponse = accumulatedResponse.replace(/\\n0:"|\\n|0:"/g, ' ');

        logRequestAndResponse(messages, filteredResponse, baseUrl).catch(console.error);

        writer.close();
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      accumulatedResponse += chunk;
      writer.write(encoder.encode(chunk));

      return reader.read().then(processText);
    });

    return new StreamingTextResponse(readable);
  } catch (error: any) {
    console.error('Server error in Azure OpenAI streaming API route:', error);
    return new NextResponse(error.message || 'Something went wrong!', {
      status: 500
    });
  }
}
