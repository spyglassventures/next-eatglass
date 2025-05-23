// File: pages/api/cirs/v1/pg_updateCirs.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

import { CIRSEntry } from "@/components/IntCIRS/dtypes";

const ALLOWED_UPDATE_FIELDS: (
    keyof Omit<CIRSEntry, 'id' | 'created_at' | 'fallnummer' | 'praxis_id'>
)[] = [
        'fachgebiet',
        'ereignis_ort',
        'ereignis_tag',
        'versorgungsart',
        'asa_klassifizierung',
        'patientenzustand',
        'begleitumstaende',
        'medizinprodukt_beteiligt',
        'fallbeschreibung',
        'positiv',
        'negativ',
        'take_home_message',
        'haeufigkeit',
        'berichtet_von',
        'berufserfahrung',
        'bemerkungen',
    ];

// Database connection pool (configure this according to your setup)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

interface UpdateRequestBody {
    id: number;
    praxisId: number;
    updates: Partial<Omit<CIRSEntry, 'id' | 'created_at' | "praxis_id">>;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PATCH') {
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { id, praxisId, updates } = req.body as UpdateRequestBody;

    // --- Input Validation ---
    if (typeof id !== 'number') {
        return res.status(400).json({ error: 'Entry ID is required and must be a number.' });
    }
    if (typeof praxisId !== 'number') {
        return res.status(400).json({ error: 'Praxis ID is required and must be a number.' });
    }

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Update data is required and must be a non-empty object.' });
    }

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
            // Check if the key is an allowed field to update
            if (ALLOWED_UPDATE_FIELDS.includes(key as any)) {
                // Ensure column names are double-quoted if they might be case-sensitive or reserved keywords
                setClauses.push(`"${key}" = $${paramIndex}`);
                values.push((updates as any)[key]);
                paramIndex++;
            } else {
                console.warn(`Attempted to update disallowed or unknown field: ${key}`);
                // Optionally, you could return a 400 error here if strictness is required
                // return res.status(400).json({ error: `Field '${key}' is not allowed for update.` });
            }
        }
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    values.push(id); // Add the ID for the WHERE clause
    values.push(praxisId); // Add the praxis ID for the WHERE clause

    const sqlQuery = `
        UPDATE cirs_entries 
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
            updatedEntry: result.rows[0] as CIRSEntry,
        });
    } catch (error: any) {
        console.error('Database error updating CIRS entry:', error);
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