// pages/api/recall/v1/pg_getRecall.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import checkUserAuthorizedWrapper from "@/components/Common/auth";
import {
  getSchemaKeys,
  RecallEntrySchemaAPIRead,
  TableName
} from "@/components/IntRecall/RecallListSchemaV1";

const QueryFields = getSchemaKeys(RecallEntrySchemaAPIRead)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function innerHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('🔵 API hit at /api/getRecall');

    try {
        const client = await pool.connect();
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        // Build the base query.
        let query = `
      SELECT
        ${QueryFields.join(', ')}
      FROM ${TableName}
      WHERE praxis_id = ${process.env.PRAXIS_ID ?? "100"}
        `;
        const params: any[] = [];

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await client.query(query, params);
        client.release();
        res.status(200).json({ recallEntries: result.rows });
    } catch (error: any) {
        console.error('Error fetching Recall entries:', error);
        res.status(500).json({ error: 'Error fetching Recall entries'});
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return checkUserAuthorizedWrapper(req, res, innerHandler)
}
