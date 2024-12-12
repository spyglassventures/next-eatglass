import fs from 'fs';
import path from 'path';

const documentsFolder = path.join(process.cwd(), 'src/config/InternalDocuments/wissensdatenbank');

export default function handler(req, res) {
    fs.readdir(documentsFolder, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${documentsFolder}`, err);
            res.status(500).json({ message: 'Failed to read documents' });
            return;
        }

        const documents = files
            .filter((file) => file.endsWith('.pdf'))
            .map((filename) => ({
                name: filename,
                filename, // Keep original filename
                path: `/api/documents/list_documents_wissensdatenbank_dyn?filename=${encodeURIComponent(filename)}`, // Encode filename for URL
                previewable: true,
                contentType: 'application/pdf',
            }));

        const { filename } = req.query;

        if (filename) {
            const decodedFilename = decodeURIComponent(filename); // Decode the URL-encoded filename
            const document = documents.find((doc) => doc.filename === decodedFilename);
            if (!document) {
                res.status(404).json({ message: 'File not found' });
                return;
            }

            const filePath = path.join(documentsFolder, decodedFilename);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error(`Error reading file: ${filePath}`, err);
                    res.status(404).json({ message: 'File not found' });
                    return;
                }

                // Sanitize the filename for Content-Disposition
                const sanitizedFilename = document.filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_'); // Replace invalid characters

                res.setHeader('Content-Type', document.contentType);
                res.setHeader(
                    'Content-Disposition',
                    `inline; filename="${encodeURIComponent(sanitizedFilename)}"`
                );
                res.end(data);
            });

        } else {
            res.status(200).json(documents);
        }
    });
}
