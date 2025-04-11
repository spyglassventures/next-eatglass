// pages/api/log.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { pool } from './customer_lib_db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('🔵 API hit at /api/log')
    console.log('📥 Request method:', req.method)

    if (req.method !== 'POST') {
        console.warn('⚠️ Only POST method is allowed')
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { customer_name, request, response: responseData } = req.body

    console.log('📝 Request Body:')
    console.log('→ customer_name:', customer_name)
    console.log('→ request:', request)
    console.log('→ response:', responseData)

    const requestContent = JSON.stringify(request, null, 2)
    const responseContent = JSON.stringify(responseData, null, 2)

    try {
        console.log('📡 Attempting DB insert...')
        const query = `
      INSERT INTO logs (customer_name, request, response)
      VALUES ($1, $2, $3)
    `
        const values = [customer_name, requestContent, responseContent]
        console.log('🧩 Query Values:', values)

        const result = await pool.query(query, values)

        console.log('✅ Insert success:', result.rowCount, 'row(s) affected')

        res.status(200).json({ message: 'Log entry created successfully' })
    } catch (error: any) {
        console.error('❌ Error inserting into DB:', error.message)
        res.status(500).json({ error: 'Internal Server Error', details: error.message })
    }
}
