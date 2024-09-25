import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import axios from 'axios';
import os from 'os';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export async function POST(request) {
    const logs = [];
    const log = (message) => {
        console.log(message);
        logs.push(message);
    };

    try {
        const { url } = await request.json();
        if (!url) {
            log('Error: No URL provided');
            return new NextResponse(JSON.stringify({ log: 'No URL provided' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        log('URL received: ' + url);

        const urlEnding = url.split('/').pop().replace(/[^a-zA-Z0-9]/g, '_');
        const vectorStoreName = `VectorStore_${urlEnding}`;
        log('Vector store name: ' + vectorStoreName);

        const downloadPDF = async (url) => {
            log('Downloading PDF from URL');
            const response = await axios.get(url, {
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/pdf',
                    'Referer': url
                }
            });

            const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'pdf-download-'));
            const filePath = path.join(tempDir, 'temp.pdf');

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            log('PDF downloaded to: ' + filePath);
            return filePath;
        };

        const uploadFile = async (filePath) => {
            log('Uploading file to OpenAI');
            const fileStreamRead = fs.createReadStream(filePath);
            const fileResponse = await client.files.create({
                file: fileStreamRead,
                purpose: 'assistants'
            });

            log('File uploaded, file ID: ' + fileResponse.id);
            return fileResponse.id;
        };

        const createVectorStoreAndUploadFile = async (fileId) => {
            log('Creating vector store...');
            const vectorStore = await client.beta.vectorStores.create({
                name: vectorStoreName,
                file_ids: [fileId]
            });
            log('Vector store created with ID: ' + vectorStore.id);
            log('File Ids: ' + [fileId]);

            const checkFileIngestion = async () => {
                log('Checking file ingestion status...');
                const updatedVectorStore = await client.beta.vectorStores.retrieve(vectorStore.id);
                log('Current file count: ' + updatedVectorStore.file_counts.total);
                if (updatedVectorStore.file_counts.total > 0) {
                    log('File ingestion completed.');
                    return updatedVectorStore;
                } else {
                    log('File ingestion not completed, retrying...');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return await checkFileIngestion();
                }
            };

            const finalVectorStore = await checkFileIngestion();
            log('Final vector store ID: ' + finalVectorStore.id);
            return finalVectorStore.id;
        };

        const filePath = await downloadPDF(url);
        const fileId = await uploadFile(filePath);
        log('File uploaded successfully: ' + fileId);

        const vectorStoreId = await createVectorStoreAndUploadFile(fileId);
        log('File uploaded to vector store successfully: ' + vectorStoreId);

        // Clean up the temporary directory
        await fs.promises.rm(path.dirname(filePath), { recursive: true, force: true });
        log('Temporary directory cleaned up.');

        return new NextResponse(JSON.stringify({ vectorStoreId, fileId, logs, log: 'File uploaded and vector store created' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        log('Error processing URL: ' + error.message);
        return new NextResponse(JSON.stringify({ log: `Error: ${error.message}`, logs }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
