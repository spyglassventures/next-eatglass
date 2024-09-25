import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const directoryPath = path.join(process.cwd(), 'src/config/InternalDocuments/Zahlungseingaenge');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, query } = req;

    switch (method) {
        case 'GET':
            if (query.fileName) {
                // Handle file download
                const filePath = path.join(directoryPath, query.fileName as string);

                if (fs.existsSync(filePath)) {
                    res.setHeader('Content-Type', 'application/xml');
                    res.setHeader('Content-Disposition', `attachment; filename=${query.fileName}`);
                    fs.createReadStream(filePath).pipe(res);
                } else {
                    res.status(404).json({ message: 'File not found' });
                }
            } else {
                // Handle file listing
                fs.readdir(directoryPath, (err, files) => {
                    if (err) {
                        res.status(500).json({ message: 'Unable to scan directory' });
                    } else {
                        res.status(200).json({ files });
                    }
                });
            }
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
