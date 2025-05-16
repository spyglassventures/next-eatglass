import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../postgres_lib_db';
import checkUserAuthorizedWrapper from "@/components/Common/auth";

async function innerHandler(req: NextApiRequest, res: NextApiResponse) {
    console.log('🔵 API hit at /pages/api/recall-list');

    if (req.method === 'POST') {
        const data = req.body;

        const fields = [
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

        const values = fields.map((field) => data[field] || null);

        try {
            const query = `
                INSERT INTO recall_list (praxis_id, ${fields.join(', ')})
                VALUES (${process.env.PRAXIS_ID ?? "100"}, ${fields.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *
            `;
            const result = await pool.query(query, values);

            return res.status(200).json({
                message: '✅ Recall-Eintrag gespeichert',
                entry: result.rows[0]
            });
        } catch (error: any) {
            console.error('❌ Fehler beim Speichern des Recall-Eintrags:', error.message);
            return res.status(500).json({ error: 'Interner Serverfehler', details: error.message });
        }
    }

    return res.status(405).json({ error: '❌ Methode nicht erlaubt' });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return checkUserAuthorizedWrapper(req, res, innerHandler)
}
