import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { integrationId } = req.query;

    console.log(`[hinDetails] Received request with integrationId: ${integrationId}`);

    if (!integrationId) {
        console.error('[hinDetails] Missing integrationId in query parameters');
        return res.status(400).json({ error: 'Missing integrationId' });
    }

    const url = `https://oauth2.sds.hin.ch/api/directory/v1/entries/${integrationId}/`;

    try {
        //const token = process.env.HIN_ACCESS_TOKEN;
        const token = process.env['HIN_ACCESS_TOKEN'];

        if (!token) {
            console.error('[hinDetails] Missing HIN_ACCESS_TOKEN in environment variables');
            return res.status(500).json({ error: 'Access token is not configured in the environment variables.' });
        }

        console.log(`[hinDetails] Fetching from URL: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(`[hinDetails] Response status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[hinDetails] Fetch failed: ${response.status} ${response.statusText} - ${errorText}`);

            return res.status(response.status).json({
                error: 'Failed to fetch detailed data',
                status: response.status,
                statusText: response.statusText,
                details: errorText
            });
        }

        const data = await response.json();
        console.log('[hinDetails] Successfully fetched data:', data);

        return res.status(200).json(data);
    } catch (error: any) {
        console.error('[hinDetails] Unexpected error:', error);

        return res.status(500).json({
            error: 'Something went wrong',
            details: error.message,
            stack: error.stack
        });
    }
}
