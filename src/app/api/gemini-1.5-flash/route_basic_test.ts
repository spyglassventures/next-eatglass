// Route for gemini-1.5-flash

import { NextResponse } from 'next/server';
const { GoogleGenerativeAI } = require('@google/generative-ai');

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new NextResponse(JSON.stringify({ error: 'Missing Gemini API Key.' }), { status: 400 });
    }

    // Initialize Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Hardcoded prompt
    const prompt = 'Explain how AI works';

    // Generate content using the Gemini API
    const result = await model.generateContent(prompt);

    return new NextResponse(
      JSON.stringify({ response: result.response.text() }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Server error:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
