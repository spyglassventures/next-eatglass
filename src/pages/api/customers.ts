// pages/api/customers.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from './lib_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('🔵 API hit at /api/customers');

    if (req.method === 'POST') {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required' });
        }

        try {
            const result = await pool.query(
                `INSERT INTO customers (name) VALUES ($1) RETURNING *`,
                [name.trim()]
            );
            return res.status(200).json({ message: 'Customer added', customer: result.rows[0] });
        } catch (error: any) {
            console.error('❌ Error inserting into customers:', error.message);
            return res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }

    if (req.method === 'GET') {
        try {
            const result = await pool.query(`SELECT id, name, created_at FROM customers ORDER BY created_at DESC`);
            return res.status(200).json({ customers: result.rows });
        } catch (error: any) {
            console.error('❌ Error fetching customers:', error.message);
            return res.status(500).json({ error: 'Failed to fetch customers' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
