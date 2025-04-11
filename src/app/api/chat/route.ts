import { AzureOpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // still Edge, the log API runs in Node

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://doc-dialog.openai.azure.com/';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-4o-mini'; // Must match your Azure OpenAI deployment name

const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

async function logRequestAndResponse(request: any, response: any) {
  const baseUrl = process.env.BASE_URL || 'https://next-eatglass.vercel.app';
  const customerName = process.env.LOG_USER || 'Unknown';
  const logUrl = `${baseUrl}/api/log`;

  console.log('📡 Logging to:', logUrl);

  try {
    const res = await fetch(logUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: customerName,
        request,
        response,
      }),
    });

    const text = await res.text();
    console.log('📦 /api/log response:', res.status, text);

    if (!res.ok) {
      console.error('❌ Failed to log:', res.statusText);
    } else {
      console.log('✅ Log saved successfully');
    }
  } catch (err: any) {
    console.error('❌ Log fetch failed:', err.message || err);
  }
}

export async function POST(req: Request) {
  try {
    console.log('🟢 POST received in OpenAI streaming handler');

    if (!apiKey) {
      console.error('❌ Missing Azure OpenAI API Key.');
      return new NextResponse('Missing Azure OpenAI API Key.', { status: 400 });
    }

    const { messages } = await req.json();

    console.log(`🤖 Calling Azure OpenAI with deployment "${deployment}"...`);

    const response = await openai.chat.completions.create({
      model: deployment,
      stream: true,
      messages
    });

    console.log('✅ Azure OpenAI response stream received');

    const stream = OpenAIStream(response as any);

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let accumulatedResponse = '';

    const reader = stream.getReader();

    await reader.read().then(async function processText({ done, value }) {
      if (done) {
        const filteredResponse = accumulatedResponse.replace(/\\n0:"|\\n|0:"/g, ' ');

        await logRequestAndResponse(messages, filteredResponse);

        await writer.close();
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      accumulatedResponse += chunk;
      await writer.write(encoder.encode(chunk));

      return reader.read().then(processText);
    });

    return new StreamingTextResponse(readable);
  } catch (error: any) {
    console.error('❌ Server error in Azure OpenAI handler:', error);
    return new NextResponse(error.message || 'Something went wrong!', {
      status: 500
    });
  }
}
