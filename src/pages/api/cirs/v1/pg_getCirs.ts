// pages/api/cirs/v1/pg_getCirs.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import checkUserAuthorizedWrapper from "@/components/Common/auth";
import cirsConfig from "@/components/IntCIRS/cirsConfigHandler";


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function innerHandler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('🔵 API hit at /api/getCirs');

    try {
        const client = await pool.connect();
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        // default praxis_id to eatglass dev
        const praxisId = parseInt(req.query.praxis_id as string) || 100;

        // Build the base query.
        let query = `
      SELECT
        id,
        fallnummer,
        praxis_id,
        fachgebiet,
        ereignis_ort,
        ereignis_tag,
        versorgungsart,
        asa_klassifizierung,
        patientenzustand,
        begleitumstaende,
        medizinprodukt_beteiligt,
        fallbeschreibung,
        positiv,
        negativ,
        take_home_message,
        haeufigkeit,
        berichtet_von,
        berufserfahrung,
        bemerkungen,
        created_at
      FROM cirs_entries
      WHERE praxis_id = ${cirsConfig.praxisID}
        `;
        const params: any[] = [];

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await client.query(query, params);
        client.release();
        res.status(200).json({ cirsEntries: result.rows });
    } catch (error: any) {
        console.error('Error fetching CIRS entries:', error);
        res.status(500).json({ error: 'Error fetching CIRS entries'});
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return checkUserAuthorizedWrapper(req, res, innerHandler)
}
