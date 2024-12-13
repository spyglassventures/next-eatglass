import { NextResponse } from 'next/server';
const { GoogleGenerativeAI } = require('@google/generative-ai');

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new NextResponse(JSON.stringify({ error: 'Missing Gemini API Key.' }), { status: 400 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Invalid or missing messages input.' }), { status: 400 });
    }

    // Extract user input from messages (e.g., latest message content)
    const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    console.log('Prepared prompt:', prompt);

    // Initialize Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let response;
    try {
      response = await model.generateContent(prompt); // Generate content dynamically based on prompt
    } catch (error) {
      console.error('Error from generateContent:', error);
      throw new Error('Failed to generate content with Gemini API.');
    }

    console.log('API Response:', response);

    const cleanResponse = response.response.text().trim();

    return new NextResponse(cleanResponse, {
      headers: { 'Content-Type': 'text/plain' },
      status: 200
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}