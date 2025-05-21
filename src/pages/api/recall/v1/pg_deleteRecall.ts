// File: pages/api/recall/v1/pg_deleteRecall.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import checkUserAuthorizedWrapper from "@/components/Common/auth";
import { TableName } from "@/components/IntRecall/RecallListSchemaV1";

// Database connection pool (configure this according to your setup)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Adjust SSL settings as per your environment
});

async function innerHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const id: any = req.body.id
    const praxisId: number | string = process.env.PRAXIS_ID ?? 100;

    // --- Input Validation ---
    if (typeof id !== 'number') {
        return res.status(400).json({ error: 'Entry ID is required and must be a number.' });
    }

    const sqlQuery = `
        DELETE FROM ${TableName}
        WHERE id = $1 AND praxis_id = $2;
    `;
    const values = [id, praxisId];

    let client;
    try {
        client = await pool.connect();
        const result = await client.query(sqlQuery, values);

        if (result.rowCount === 0) {
            // This means no row matched the id and praxis_id,
            // either it doesn't exist or praxis_id doesn't match.
            return res.status(404).json({ error: `Entry with ID ${id} not found for praxis ID ${praxisId}, or already deleted.` });
        }

        // Successfully deleted
        return res.status(200).json({
            message: `Entry with ID ${id} deleted successfully.`,
        });
        // Alternatively, for DELETE, a 204 No Content response is also common:
        // return res.status(204).end();
    } catch (error: any) {
        console.error('Database error deleting Recall entry:', error);
        return res.status(500).json({
            error: 'Failed to delete entry.',
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
