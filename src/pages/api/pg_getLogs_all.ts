// pages/api/pg_getLogs.ts
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
        const limit = parseInt(req.query.limit as string) || 3;
        const offset = parseInt(req.query.offset as string) || 0;

        // Cast JSONB to text so that functions like LEFT work if needed.
        // (Here we return the full text so the front end can decide how to truncate it.)
        const query = `
      SELECT 
         id, 
         customer_name, 
         request::text AS request, 
         response::text AS response, 
         timestamp 
      FROM logs 
      ORDER BY id DESC 
      LIMIT $1 OFFSET $2
    `;
        const result = await client.query(query, [limit, offset]);
        client.release();
        res.status(200).json({ logs: result.rows });
    } catch (error: any) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
}
