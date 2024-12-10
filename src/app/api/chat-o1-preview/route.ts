import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse(JSON.stringify({ error: 'Missing OpenAI API Key.' }), { status: 400 });
    }

    const { messages } = await req.json();

    // Force the messages format, ensuring role as 'user'
    const formattedMessages = messages.map((message: { content: string }) => ({
      role: 'user',
      content: message.content,
    }));

    // Use OpenAI API to generate the response
    const response = await openai.chat.completions.create({
      model: 'o1-preview',
      messages: formattedMessages,
    });

    // Extract and format the final content as readable text
    const rawContent = response.choices[0]?.message?.content || '';
    const readableContent = formatReadableContent(rawContent);

    return new Response(readableContent, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}

// Helper function to format the response to clean text with preserved sections and line breaks
function formatReadableContent(rawContent: string): string {
  return rawContent
    .replace(/(?<!\n)\n(?!\n)/g, ' ') // Merge single newlines into a single line
    // .replace(/(?:\*\*|\*|-{3})/g, '') // Remove asterisks and horizontal line markers
    .replace(/\s*- /g, '\n- ') // Ensure list items start on new lines
    .replace(/(\n\n)+/g, '\n\n') // Replace multiple blank lines with a single blank line
    .trim(); // Trim any leading/trailing whitespace
}
