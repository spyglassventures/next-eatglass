// next-kappelihof/src/pages/api/readFile.ts

import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { fileName } = req.query;

    if (!fileName) {
        res.status(400).json({ error: 'File name is required' });
        return;
    }

    const filePath = path.join(process.cwd(), 'src/config/InternalDocuments/Zahlungseingaenge', fileName as string);

    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found' });
        return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json({ content: fileContent });
}
