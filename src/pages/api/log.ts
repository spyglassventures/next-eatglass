import { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { customer_name, request, response } = req.body

    try {
        const client = await pool.connect()

        const requestContent = JSON.stringify(request)
        // Ensure the response is a valid JSON string
        const responseContent = JSON.stringify(response) || 'No response content found'

        await client.query(
            'INSERT INTO logs (customer_name, request, response) VALUES ($1, $2, $3)',
            [customer_name, requestContent, responseContent]
        )
        client.release()
        res.status(200).json({ message: 'Log entry created successfully' })
    } catch (error) {
        console.error('Error logging request and response:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


// SELECT * FROM logs
// WHERE id = (SELECT MAX(id) FROM logs);


// SELECT * FROM logs
// WHERE id = (SELECT MAX(id) FROM logs);

// code works, creates logs but with some additional characters, doublication at the end? not sure
// select id, customer_name, request, timestamp from logs;
// \d logs