import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "edge";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function POST(req: Request) {
  try {
    console.log("POST request received in streaming API route.");

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API Key.");
      return new NextResponse(
        JSON.stringify({ error: "Missing OpenAI API Key." }),
        { status: 400 }
      );
    }

    // Parse the incoming JSON
    const body = await req.json();
    const { messages, customerName: customerNameFromRequest, response_format } = body;
    const customerName = process.env.LOG_USER || customerNameFromRequest || "Unknown";
    console.log("Parsed request body:", { messages, customerName });

    if (!response_format) {
      console.error("Missing response_format in request body.");
      return new NextResponse(
        JSON.stringify({ error: "Missing response_format in request body." }),
        { status: 400 }
      );
    }

    // Define the model dynamically and explicitly type it as string
    const model: string = "o3-mini-2025-01-31";
    console.log(`Calling OpenAI API with model "${model}"...`);

    // Start the OpenAI structured response chat completion
    // const completion = await openai.beta.chat.completions.parse({
    const completion = await (openai.beta.chat.completions as any).parse({
      model,
      messages,
      response_format,
      reasoning_effort: "medium"
    });

    console.log("Received structured response from OpenAI:", completion);

    // Extract response content using a type assertion to inform TypeScript
    const message = completion.choices?.[0]?.message as unknown as { content: string };
    const responseData = message.content;

    if (!responseData) {
      console.error("OpenAI returned an empty response.");
      return new NextResponse(
        JSON.stringify({ error: "Empty response from OpenAI" }),
        { status: 500 }
      );
    }

    console.log("Parsed response:", responseData);

    // Log request and response to the database
    try {
      const logPayload = {
        customer_name: customerName,
        request: { messages },
        response: responseData
      };

      console.log("Attempting to log request and response:", logPayload);

      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      await fetch(`${baseUrl}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logPayload)
      });

      console.log("Successfully logged request and response.");
    } catch (logError) {
      console.error("Error logging request and response:", logError);
    }

    return new NextResponse(
      JSON.stringify({ DocDialogOutput: responseData }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Server error in structured response API route:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
