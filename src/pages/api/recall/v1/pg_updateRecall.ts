// File: pages/api/recall/v1/pg_updateRecall.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

import { RecallEntry } from "@/components/IntRecall/dtypes";
import checkUserAuthorizedWrapper from "@/components/Common/auth";

const ALLOWED_UPDATE_FIELDS: (
    keyof Omit<RecallEntry, 'id' | 'created_at' | 'praxis_id'>
)[] = [
      'patient_id',
      'vorname',
      'nachname',
      'geburtsdatum',
      'erinnerungsanlass',
      'recallsystem',
      'kontaktinfo',
      'periodicity_interval',
      'periodicity_unit',
      'recall_target_datum',
      'reminder_send_date',
      'responsible_person',
      'rueckmeldung_erhalten',
      'sms_template',
      'email_template',
      'letter_template',
      'recall_done',
      'naechster_termin',
      'appointment_status',
      'zusaetzliche_laborwerte',
      'zusaetzliche_diagnostik',
      'bemerkungen'
    ];

// Database connection pool (configure this according to your setup)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

interface UpdateRequestBody {
    id: number;
    updates: Partial<Omit<RecallEntry, 'id' | 'created_at' | "praxis_id">>;
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
        UPDATE recall_entries
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
            updatedEntry: result.rows[0] as RecallEntry,
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
