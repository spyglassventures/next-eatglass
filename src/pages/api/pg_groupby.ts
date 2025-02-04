// pages/api/pg_groupby.ts

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
        const query = `
      SELECT 
        customer_name,
        COUNT(id) AS count
      FROM logs
      GROUP BY customer_name
      ORDER BY count DESC
    `;
        const result = await client.query(query);
        client.release();
        res.status(200).json({ logs: result.rows });
    } catch (error: any) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
}
