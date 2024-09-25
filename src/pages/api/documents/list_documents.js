// next-kappelihof/src/pages/api/documents/list_documents.js

import fs from 'fs';
import path from 'path';
import documents from '../../../config/InternalDocuments/filesConfig'; // Import the document configuration

export default function handler(req, res) {
    // Map documents to include filepath
    const mappedDocuments = documents.map(doc => ({
        ...doc,
        filepath: path.join(process.cwd(), `src/config/InternalDocuments/${doc.filename}`),
    }));

    const { filename } = req.query;
    const document = mappedDocuments.find(doc => doc.filename === filename);

    if (!document) {
        res.status(404).json({ message: 'File not found' });
        return;
    }

    fs.readFile(document.filepath, (err, data) => {
        if (err) {
            console.error(`Error reading file: ${document.filepath}`, err);
            res.status(404).json({ message: 'File not found' });
            return;
        }

        res.setHeader('Content-Type', document.contentType);
        res.setHeader('Content-Disposition', `inline; filename=${document.filename}`);
        res.send(data);
    });
}
