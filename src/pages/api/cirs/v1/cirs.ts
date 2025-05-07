import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../postgres_lib_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('🔵 API hit at /pages/api/cirs');

    if (req.method === 'POST') {
        const data = req.body;

        const fields = [
            'praxis_id',
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
            'bemerkungen'
        ];


        const values = fields.map((field) => data[field] || null);

        try {
            // Generiere Fallnummer (z. B. CIRS-2025-0001)
            const year = new Date().getFullYear();
            const prefix = `CIRS-${year}`;
            const { rows: countRows } = await pool.query(
                `SELECT COUNT(*) FROM cirs_entries WHERE EXTRACT(YEAR FROM created_at) = $1`,
                [year]
            );
            const laufnummer = String(Number(countRows[0].count) + 1).padStart(4, '0');
            const fallnummer = `${prefix}-${laufnummer}`;

            const query = `
        INSERT INTO cirs_entries (fallnummer, ${fields.join(', ')})
        VALUES ($1, ${fields.map((_, i) => `$${i + 2}`).join(', ')})
        RETURNING *
      `;
            const result = await pool.query(query, [fallnummer, ...values]);

            return res.status(200).json({
                message: '✅ CIRS-Fall gespeichert',
                entry: result.rows[0]
            });
        } catch (error: any) {
            console.error('❌ Fehler beim Speichern des CIRS-Falls:', error.message);
            return res.status(500).json({ error: 'Interner Serverfehler', details: error.message });
        }
    }

    return res.status(405).json({ error: '❌ Methode nicht erlaubt' });
}
