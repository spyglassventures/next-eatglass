import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { pool } from '../../postgres_lib_db';
import checkUserAuthorizedWrapper from "@/components/Common/auth";
import { RecallEntrySchemaDBCreate, TableName } from "@/components/IntRecall/RecallListSchemaV1";
import recallConfig from "@/components/IntRecall/recallConfigHandler";

async function innerHandler(req: NextApiRequest, res: NextApiResponse) {
    console.log('🔵 API hit at /pages/api/recall-list');
    if (req.method !== 'POST') {
      return res.status(405).json({ error: '❌ Methode nicht erlaubt' });
    }

    try {
        const parsedData = RecallEntrySchemaDBCreate.parse(req.body)
        const { ...values } = parsedData; // Extract values
        const fields = Object.keys(values)
        const query = `
            INSERT INTO ${TableName} (praxis_id, ${fields.join(', ')})
            VALUES (${recallConfig.praxisID}, ${fields.map((_, i) => `$${i + 1}`).join(', ')})
            RETURNING *
        `;
        const result = await pool.query(query, Object.values(values));

        return res.status(201).json({
            message: '✅ Recall-Eintrag gespeichert',
            entry: result.rows[0]
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('❌ Fehler beim Speichern des Recall-Eintrags:', error.message);
        return res.status(500).json({ error: 'Interner Serverfehler', details: error.message });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return checkUserAuthorizedWrapper(req, res, innerHandler)
}
