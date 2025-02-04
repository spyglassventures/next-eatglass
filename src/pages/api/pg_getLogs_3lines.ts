// pages/api/getLogs.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const client = await pool.connect();

        // Casting JSONB to text using "::text" allows the LEFT() function to work properly.
        const result = await client.query(
            `SELECT 
         id, 
         customer_name, 
         LEFT(request::text, 50) AS request, 
         LEFT(response::text, 50) AS response, 
         timestamp 
       FROM logs 
       ORDER BY id DESC 
       LIMIT 3`
        );

        client.release();
        res.status(200).json({ logs: result.rows });
    } catch (error: any) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
}
