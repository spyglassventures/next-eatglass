// pages/api/hinDetails.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import tokenData from './token.json'; // Importing token from JSON file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { integrationId } = req.query; // Extract the integrationId from the query

    // Hardcode the base URL and append the integrationId
    const url = `https://oauth2.sds.hin.ch/api/directory/v1/entries/${integrationId}/`;

    try {
        // Use the token from the imported JSON file
        const token = tokenData.token;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Use the token from JSON
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch detailed data' });
        }

        const data = await response.json();
        res.status(200).json(data); // Send detailed data back to the frontend
    } catch (error) {
        console.error('Failed to fetch data from external API:', error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
}
