// pages/api/hinSearch.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { search } = req.query;

    console.log(`[hinSearch] Received request with search query: ${search}`);

    if (!search) {
        console.error('[hinSearch] Missing search query');
        return res.status(400).json({
            error: 'Missing search query.',
            userMessage: 'Please provide a valid search term.',
            support: 'If the issue persists, contact dm@spyglassventures.ch.'
        });
    }

    const url = `https://oauth2.sds.hin.ch/api/directory/v1/entries/?search=${encodeURIComponent(search as string)}`;

    try {
        const token = process.env.HIN_ACCESS_TOKEN;

        if (!token) {
            console.error('[hinSearch] ERROR: HIN_ACCESS_TOKEN is missing.');
            return res.status(500).json({
                error: 'Configuration error: Missing API token.',
                userMessage: 'The API token is missing. Please check the server configuration or contact support.',
                hint: 'Ensure that HIN_ACCESS_TOKEN is set in your .env.local file and restart the server.',
                support: 'If the issue persists, contact dm@spyglassventures.ch.'
            });
        }

        const expectedLength = 40;

        if (token.includes('$')) {
            console.warn(`[hinSearch] WARNING: Your HIN_ACCESS_TOKEN contains a "$" symbol. It may be misinterpreted.`);
            return res.status(500).json({
                error: 'Invalid token format.',
                userMessage: 'Your API token contains a special character ($) that may be causing issues.',
                hint: 'Generate a new API token without "$" and update it in your .env.local file.',
                support: 'If the issue persists, contact dm@spyglassventures.ch.'
            });
        }

        if (token.length !== expectedLength) {
            console.warn(`[hinSearch] WARNING: The token length is incorrect. Expected ${expectedLength}, got ${token.length}.`);
            return res.status(500).json({
                error: 'Incorrect token length.',
                userMessage: `The API token length is incorrect. Expected ${expectedLength} characters, but received ${token.length}.`,
                hint: 'Verify that the token in your .env.local file is correct and fully loaded.',
                support: 'If the issue persists, contact dm@spyglassventures.ch.'
            });
        }

        console.log(`[hinSearch] Token is valid. Proceeding with API request.`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });

        console.log(`[hinSearch] Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[hinSearch] API request failed with status ${response.status}: ${errorText}`);

            return res.status(response.status).json({
                error: `HIN API Error (${response.status})`,
                userMessage: `The request to HIN API failed with status ${response.status}: ${response.statusText}.`,
                hint: 'Ensure the API token is valid and has the correct permissions. If the issue persists, contact support.',
                support: 'If the issue persists, contact dm@spyglassventures.ch.',
                details: errorText
            });
        }

        const data = await response.json();
        console.log('[hinSearch] Successfully fetched data');

        return res.status(200).json(data);
    } catch (error: any) {
        console.error('[hinSearch] Unexpected error:', error);

        return res.status(500).json({
            error: 'Unexpected Server Error',
            userMessage: 'Something went wrong while processing your request.',
            hint: 'Try again later. If the issue persists, contact support.',
            support: 'If the issue persists, contact dm@spyglassventures.ch.',
            details: error.message
        });
    }
}
