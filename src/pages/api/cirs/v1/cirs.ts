import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../postgres_lib_db';
import checkUserAuthorizedWrapper from "@/components/Common/auth";
import cirsConfig from "@/components/IntCIRS/cirsConfigHandler";

const generateFallnummer = async () => {
  /* Generiere Fallnummer (z. B. CIRS-2025-0001)

  - Race-Condition! unique constraint may be violated
  - Flawed Logic: deleting non-latest entry creates collision

  Should be handled by database:

-- create sequence
CREATE SEQUENCE cirs_annual_seq;

-- store sequence reset per year
CREATE TABLE IF NOT EXISTS sequence_reset_state (
    sequence_name TEXT PRIMARY KEY,
    last_reset_year INTEGER
);

-- manually set state for running year. Skips if cirs_entries is empty
WITH max_year_table AS (
    SELECT MAX(CAST(SUBSTRING(fallnummer FROM 'CIRS-(\d{4})-\d+') AS INTEGER)) as max_year
    FROM cirs_entries
)
SELECT SETVAL(
    'cirs_annual_seq',
    COALESCE(
        (
            SELECT MAX(CAST(SUBSTRING(fallnummer FROM 'CIRS-\d{4}-(\d+)') AS INTEGER))
            FROM cirs_entries
            WHERE CAST(SUBSTRING(fallnummer FROM 'CIRS-(\d{4})-\d+') AS INTEGER) = (
                SELECT max_year FROM max_year_table
            )
        ),
        0
    ),
    true
) WHERE (SELECT COUNT(*) FROM cirs_entries) > 0;

WITH max_year_table AS (
    SELECT MAX(CAST(SUBSTRING(fallnummer FROM 'CIRS-(\d{4})-\d+') AS INTEGER)) as max_year
    FROM cirs_entries
)
INSERT INTO sequence_reset_state (sequence_name, last_reset_year)
SELECT 'cirs_annual_seq', COALESCE(
    (
        SELECT MAX(CAST(SUBSTRING(fallnummer FROM 'CIRS-(\d{4})-\d+') AS INTEGER))
        FROM cirs_entries
    ),
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
)
WHERE EXISTS (SELECT 1 FROM cirs_entries LIMIT 1);

-- Create the function (which will be called by the trigger)
CREATE OR REPLACE FUNCTION set_fallnummer_annual()
RETURNS TRIGGER AS $$
DECLARE
    current_year INTEGER;
    v_last_reset_year INTEGER; -- Changed variable name for clarity
    next_val BIGINT;
    formatted_suffix TEXT;
BEGIN
    current_year := EXTRACT(YEAR FROM NEW.created_at);

    -- Fix: Qualify the column name with the table name
    SELECT s.last_reset_year INTO v_last_reset_year
    FROM sequence_reset_state s  -- Use an alias 's' for the table
    WHERE s.sequence_name = 'cirs_annual_seq' FOR UPDATE;

    IF NOT FOUND OR v_last_reset_year IS NULL OR current_year > v_last_reset_year THEN
        -- Reset sequence and update v_last_reset_year
        PERFORM setval('cirs_annual_seq', 1, false);
        IF FOUND THEN
            UPDATE sequence_reset_state SET last_reset_year = current_year WHERE sequence_name = 'cirs_annual_seq';
        ELSE
            INSERT INTO sequence_reset_state (sequence_name, last_reset_year) VALUES ('cirs_annual_seq', current_year);
        END IF;
    END IF;

    -- Get the next value for the current year
    next_val := nextval('cirs_annual_seq');
    formatted_suffix := LPAD(next_val::TEXT, 4, '0');

    -- Assign the new fallnummer
    NEW.fallnummer := 'CIRS-' || current_year::TEXT || '-' || formatted_suffix;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER before_insert_cirs_fallnummer
BEFORE INSERT ON cirs_entries
FOR EACH ROW
EXECUTE FUNCTION set_fallnummer_annual();
  */
  const year = new Date().getFullYear();
  const prefix = `CIRS-${year}`;
  const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM cirs_entries WHERE EXTRACT(YEAR FROM created_at) = $1`,
      [year]
  );
  const laufnummer = String(Number(countRows[0].count) + 1).padStart(4, '0');
  return `${prefix}-${laufnummer}`;
}


async function innerHandler(req: NextApiRequest, res: NextApiResponse) {
    console.log('🔵 API hit at /pages/api/cirs');

    if (req.method === 'POST') {
        const data = req.body;

        const fields = [
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
            const fallnummer = await generateFallnummer();
            // fallnummer kann entfallen oder leerer string sein, wenn die
            // Datenbank die GEnerierung übernimmt.

            const query = `
        INSERT INTO cirs_entries (praxis_id, fallnummer, ${fields.join(', ')})
        VALUES ($1, $2, ${fields.map((_, i) => `$${i + 3}`).join(', ')})
        RETURNING *
        `;
            const result = await pool.query(query, [cirsConfig.praxisID, fallnummer, ...values]);

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return checkUserAuthorizedWrapper(req, res, innerHandler)
}
