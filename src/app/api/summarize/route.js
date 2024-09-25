//src/app/api/summarize/route.js
// FOR PDF SUMMARIZATION

import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export async function POST(request) {
    try {
        const { vectorStoreId, fileId } = await request.json();
        if (!vectorStoreId || !fileId) {
            console.log('Error: Missing vectorStoreId or fileId');
            return new NextResponse(JSON.stringify({ log: 'Missing vectorStoreId or fileId' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const assistant = await client.beta.assistants.create({
            name: "Personal Assistant",
            instructions: "You are an empathetic assistant. Use your knowledge base to answer questions.",
            model: "gpt-4-turbo",
            tools: [{ type: "file_search" }],
            tool_resources: {
                file_search: {
                    vector_store_ids: [vectorStoreId]
                }
            }
        });

        console.log('Assistant created successfully:', assistant.id);

        const thread = await client.beta.threads.create({
            messages: [
                {
                    role: "user",
                    content: "Fasse das Dokument zusammen.",
                    attachments: [{ file_id: fileId, tools: [{ type: "file_search" }] }]
                },
            ]
        });

        console.log('Thread created with ID:', thread.id);

        const result = await new Promise((resolve, reject) => {
            let summary = '';
            client.beta.threads.runs
                .stream(thread.id, { assistant_id: assistant.id })
                .on("textCreated", () => console.log("assistant >"))
                .on("toolCallCreated", (event) => console.log("assistant " + event.type))
                .on("messageDone", async (event) => {
                    if (event.content[0].type === "text") {
                        const { text } = event.content[0];
                        const { annotations } = text;
                        const citations = [];

                        let index = 0;
                        for (let annotation of annotations) {
                            text.value = text.value.replace(annotation.text, "[" + index + "]");
                            const { file_citation } = annotation;
                            if (file_citation) {
                                const citedFile = await client.files.retrieve(file_citation.file_id);
                                citations.push("[" + index + "]" + citedFile.filename);
                            }
                            index++;
                        }

                        console.log(text.value);
                        console.log(citations.join("\n"));
                        summary = text.value;
                        resolve(summary);
                    }
                });
        });

        console.log('Returning summary:', result);

        return new NextResponse(JSON.stringify({ summary: result, log: 'Processing complete' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error processing URL:', error);
        return new NextResponse(JSON.stringify({ log: `Error: ${error.message}` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
