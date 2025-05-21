// File: pages/api/recall/v1/pg_updateRecall.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

import checkUserAuthorizedWrapper from "@/components/Common/auth";
import {
  TableName, RecallEntrySchemaDBUpdate, TRecallEntrySchemaAPIUpdate, TRecallEntry, RecallEntrySchemaAPIRead
} from "@/components/IntRecall/RecallListSchemaV1";


// Database connection pool (configure this according to your setup)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

interface UpdateRequestBody {
    id: number;
    updates: TRecallEntrySchemaAPIUpdate;
}

async function innerHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PATCH') {
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { id, updates } = req.body as UpdateRequestBody;
    const praxisId: number | string = process.env.PRAXIS_ID ?? 100;

    // --- Input Validation ---
    if (typeof id !== 'number') {
        return res.status(400).json({ error: 'Entry ID is required and must be a number.' });
    }

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Update data is required and must be a non-empty object.' });
    }

    const parsedUpdates = RecallEntrySchemaDBUpdate.parse(updates)
    if (Object.keys(parsedUpdates).length === 0) {
        return res.status(400).json({ error: 'No valid update data provided.' });
    }

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const key in parsedUpdates) {
        if (Object.prototype.hasOwnProperty.call(parsedUpdates, key)) {
            // Ensure column names are double-quoted if they might be case-sensitive or reserved keywords
            setClauses.push(`"${key}" = $${paramIndex}`);
            values.push((parsedUpdates as any)[key]);
            paramIndex++;
        }
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    values.push(id); // Add the ID for the WHERE clause
    values.push(praxisId); // Add the praxis ID for the WHERE clause

    const sqlQuery = `
        UPDATE ${TableName}
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex} AND praxis_id = $${paramIndex + 1}
        RETURNING *;
    `;

    let client;
    try {
        client = await pool.connect();
        const result = await client.query(sqlQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: `Entry with ID ${id} not found or no changes applied.` });
        }

        return res.status(200).json({
            message: 'Entry updated successfully.',
            updatedEntry: result.rows[0],
        });
    } catch (error: any) {
        console.error('Database error updating Recall entry:', error);
        return res.status(500).json({
            error: 'Failed to update entry.',
            details: error.message,
        });
    } finally {
        if (client) {
            client.release();
        }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return checkUserAuthorizedWrapper(req, res, innerHandler)
}
