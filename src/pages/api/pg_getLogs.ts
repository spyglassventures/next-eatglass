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
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const customerName = req.query.customer_name as string | undefined;
        const excludeDev = req.query.exclude_dev === 'true';

        // Build the base query.
        let query = `
      SELECT 
         id, 
         customer_name, 
         request::text AS request, 
         response::text AS response, 
         timestamp 
      FROM logs
    `;
        const params: any[] = [];
        const conditions: string[] = [];

        if (customerName) {
            conditions.push(`customer_name = $${params.length + 1}`);
            params.push(customerName);
        }
        if (excludeDev) {
            conditions.push(`customer_name NOT LIKE $${params.length + 1}`);
            params.push('%_dev');
        }
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
        query += ` ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await client.query(query, params);
        client.release();
        res.status(200).json({ logs: result.rows });
    } catch (error: any) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
}
