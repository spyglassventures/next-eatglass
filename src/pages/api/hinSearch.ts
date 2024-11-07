// pages/api/hinSearch.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import tokenData from './token.json'; // Importing token from the JSON file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { search, limit = 250 } = req.query; // Default limit is 300

    try {
        const token = tokenData.token;
        const maxResults = Number(limit);

        // Function to recursively fetch all pages up to the limit
        const fetchAllPages = async (url: string, results: any[] = []): Promise<any[]> => {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data from HIN API');
            }

            const data = await response.json();
            results.push(...data.results);

            // Stop fetching if we reach the limit
            if (results.length >= maxResults) {
                return results.slice(0, maxResults);
            }

            // If there is a next page, continue fetching
            if (data.next) {
                return fetchAllPages(data.next, results);
            }

            return results;
        };

        // Start fetching from the first page
        const initialUrl = `https://oauth2.sds.hin.ch/api/directory/v1/entries/?search=${search}`;
        const allResults = await fetchAllPages(initialUrl);

        res.status(200).json({ results: allResults });
    } catch (error) {
        console.error('Error in API handler:', error.message);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
}
