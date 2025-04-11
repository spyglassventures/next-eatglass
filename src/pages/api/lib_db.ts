// lib/db.ts
import { Pool } from 'pg'

declare global {
    var pgPool: Pool | undefined
}

export const pool =
    global.pgPool ||
    new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

if (process.env.NODE_ENV !== 'production') global.pgPool = pool
