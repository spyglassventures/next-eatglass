// pages/api/hinDetails.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { integrationId } = req.query; // Extract the integrationId from the query

    // Construct the URL using the provided integrationId
    const url = `https://oauth2.sds.hin.ch/api/directory/v1/entries/${integrationId}/`;

    try {
        // Retrieve the token from the environment variables
        const token = process.env.HIN_ACCESS_TOKEN;

        // If the token isn't available, return an error
        if (!token) {
            return res.status(500).json({ error: 'Access token is not configured in the environment variables.' });
        }

        // Fetch the detailed data from the external API using the token
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch detailed data' });
        }

        const data = await response.json();
        res.status(200).json(data); // Send the detailed data back to the frontend
    } catch (error: any) {
        console.error('Failed to fetch data from external API:', error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
}
