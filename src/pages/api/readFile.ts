
// To restrict file access in your API route to only allow reading files from the src/config/InternalDocuments/Zahlungseingaenge directory, 
// you should validate that the requested file is within this directory and ensure there is no directory traversal attack (e.g., ../../ in the file path).

// Filename: src/pages/api/readFile.ts

import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { fileName } = req.query;

    if (!fileName || typeof fileName !== 'string') {
        res.status(400).json({ error: 'Valid file name is required' });
        return;
    }

    // Define the base directory
    const baseDir = path.join(process.cwd(), 'src/config/InternalDocuments/Zahlungseingaenge');

    // Resolve the absolute path of the requested file
    const resolvedPath = path.resolve(baseDir, fileName);

    // Ensure the resolved path is within the base directory
    if (!resolvedPath.startsWith(baseDir)) {
        res.status(403).json({ error: 'Access to the requested file is forbidden' });
        return;
    }

    // Check if the file exists
    if (!fs.existsSync(resolvedPath)) {
        res.status(404).json({ error: 'File not found' });
        return;
    }

    try {
        // Read the file content
        const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
        res.status(200).json({ content: fileContent });
    } catch (error) {
        // Handle any errors that occur while reading the file
        res.status(500).json({ error: 'An error occurred while reading the file' });
    }
}
