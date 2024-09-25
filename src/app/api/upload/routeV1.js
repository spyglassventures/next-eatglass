
//src/app/api/upload/route.js
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import axios from 'axios';

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

        const urlEnding = path.basename(url).replace(/[^a-zA-Z0-9]/g, '_');
        const vectorStoreName = `VectorStore_${urlEnding}`;
        log('Vector store name: ' + vectorStoreName);

        const downloadDir = path.join(process.cwd(), 'downloads');
        if (!fs.existsSync(downloadDir)) {
            log('Creating downloads directory');
            fs.mkdirSync(downloadDir);
        }

        const downloadPDF = async (url) => {
            log('Downloading PDF from URL');
            const response = await axios.get(url, { responseType: 'stream' });
            const filePath = path.join(downloadDir, 'temp.pdf');

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
