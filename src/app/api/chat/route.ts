// next-kappelihof/src/app/api/chat/route.ts
// we also need the pages/api/log.ts file to log the AI request and response to the database


import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

async function logRequestAndResponse(request: any, response: any, baseUrl: string) {
  // for Logging
  const customerName = process.env.LOG_USER; // Fetching the environment variable LOG_USER

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
    })
  } catch (error) {
    console.error('Error logging request and response:', error)
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse('Missing OpenAI API Key.', { status: 400 })
    }

    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages
    })

    const stream = OpenAIStream(response)

    // Create a TransformStream to accumulate the response
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let accumulatedResponse = ''

    // Read from the OpenAI stream and write to the TransformStream
    const reader = stream.getReader()

    reader.read().then(function processText({ done, value }) {
      if (done) {
        // Log request and complete response asynchronously
        const protocol = req.headers.get('x-forwarded-proto') || 'https'
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
        const baseUrl = `${protocol}://${host}`

        // Remove break characters from the accumulated response
        const filteredResponse = accumulatedResponse.replace(/\\n0:"|\\n|0:"/g, ' ')

        logRequestAndResponse(messages, filteredResponse, baseUrl).catch(console.error)

        writer.close()
        return
      }

      const chunk = decoder.decode(value, { stream: true })
      accumulatedResponse += chunk
      writer.write(encoder.encode(chunk))

      return reader.read().then(processText)
    })

    return new StreamingTextResponse(readable)
  } catch (error: any) {
    return new NextResponse(error.message || 'Something went wrong!', {
      status: 500
    })
  }
}







// psql (14.12, server 16.3)

// code works, creates logs but with some additional characters, doublication at the end? not sure