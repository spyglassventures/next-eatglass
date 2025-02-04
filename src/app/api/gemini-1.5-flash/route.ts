import { NextResponse } from 'next/server';
const { GoogleGenerativeAI } = require('@google/generative-ai');

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    console.log('POST request received for Gemini integration.');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing Gemini API Key.');
      return new NextResponse(
        JSON.stringify({ error: 'Missing Gemini API Key.' }),
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { messages, customerName: customerNameFromRequest } = body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid or missing messages input.');
      return new NextResponse(
        JSON.stringify({ error: 'Invalid or missing messages input.' }),
        { status: 400 }
      );
    }

    // Prepare prompt from messages
    const prompt = messages
      .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
      .join('\n');
    console.log('Prepared prompt:', prompt);

    // Initialize Gemini API client and model
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });
    console.log(`Calling Gemini API with model "${modelName}"...`);

    // Call Gemini API to generate content
    let response;
    try {
      response = await model.generateContent(prompt);
    } catch (error) {
      console.error('Error from generateContent:', error);
      throw new Error('Failed to generate content with Gemini API.');
    }
    console.log('Gemini API Response:', response);

    // Clean the response text
    const cleanResponse = response.response.text().trim();
    console.log('Clean response:', cleanResponse);

    // Determine the customer name (environment variable or request value, fallback to "Unknown")
    const customerName = process.env.LOG_USER || customerNameFromRequest || 'Unknown';
    console.log('Customer name:', customerName);

    // Log the request and response to the internal logging endpoint
    try {
      // Concatenate the model name with the response in the log
      const logPayload = {
        customer_name: customerName,
        model: modelName,
        request: prompt,
        response: `${modelName}, ${cleanResponse}`,
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

    // Return the clean response to the client
    return new NextResponse(cleanResponse, {
      headers: { 'Content-Type': 'text/plain' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
