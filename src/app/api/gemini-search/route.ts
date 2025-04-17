import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    console.log('POST request received for Gemini 2.0 + Google Search grounding');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new NextResponse(JSON.stringify({ error: 'Missing Gemini API Key.' }), {
        status: 400,
      });
    }

    const body = await req.json();
    const { messages, customerName: customerNameFromRequest } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Invalid or missing messages input.' }), {
        status: 400,
      });
    }

    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    console.log('Prepared contents:', contents);

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = 'gemini-2.0-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent({
      contents,
      tools: [{ googleSearch: {} }] as any, // ✅ This is now correct
    });

    const cleanResponse = result.response.text().trim();
    const candidate = result.response?.candidates?.[0];

    const groundingMeta = candidate?.groundingMetadata as any;

    const renderedHtml = groundingMeta?.searchEntryPoint?.renderedContent || '';
    const sources = groundingMeta?.groundingChunks?.map((chunk: any) => chunk.web) || [];

    const searchQueries = groundingMeta?.webSearchQueries || [];

    const customerName = process.env.LOG_USER || customerNameFromRequest || 'Unknown';

    // Logging

    const readablePrompt = contents.map(c => `${c.role}: ${c.parts.map(p => p.text).join(' ')}`).join('\n');


    try {
      const logPayload = {
        customer_name: customerName,
        model: modelName,
        request: readablePrompt,
        response: `${modelName}, ${cleanResponse}`,
        searchQueries,
      };

      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logPayload),
      });
    } catch (logError) {
      console.error('Logging failed:', logError);
    }

    return new NextResponse(
      JSON.stringify({
        text: cleanResponse,
        renderedHtml,
        sources,
        searchQueries,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Server error:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
