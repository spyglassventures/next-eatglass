// next-kappelihof/src/pages/api/listFiles.ts

import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const directoryPath = path.join(process.cwd(), 'src/config/InternalDocuments/Zahlungseingaenge');
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.xml'));

    res.status(200).json({ files });
}
