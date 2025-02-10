import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export const runtime = "edge";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

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
    const { messages, customerName: customerNameFromRequest } = body;
    const customerName = process.env.LOG_USER || customerNameFromRequest || "Unknown";
    console.log("Parsed request body:", { messages, customerName });

    // Define the model dynamically
    // const model = "gpt-4o-2024-08-06";
    const model = 'o3-mini-2025-01-31';
    console.log(`Calling OpenAI API with model "${model}"...`);

    // Start the OpenAI structured response chat completion
    const completion = await openai.beta.chat.completions.parse({
      model,
      messages,
      response_format: zodResponseFormat(MathReasoning, "math_reasoning"),
    });

    console.log("Received structured response from OpenAI.");
    const math_reasoning = completion.choices[0]?.message?.parsed;
    console.log("Parsed math reasoning:", math_reasoning);

    // Log request and response to the database
    try {
      const logPayload = {
        customer_name: customerName,
        request: { messages },
        response: { model, math_reasoning },
      };

      console.log("Attempting to log request and response:", logPayload);

      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      await fetch(`${baseUrl}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logPayload),
      });
      console.log("Successfully logged request and response.");
    } catch (logError) {
      console.error("Error logging request and response:", logError);
    }

    return new NextResponse(
      JSON.stringify({ math_reasoning }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Server error in structured response API route:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
