// app/api/log/route.ts
import { NextResponse } from 'next/server';
//import { pool } from '@/app/lib/db'; // adjust this path if your `lib/db.ts` is elsewhere
import { pool } from './lib_db'

// force to run on note runtime, not edge. Othewise we only log the first request
export const runtime = 'nodejs';


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customer_name, request, response: responseData } = body;

        const requestContent = JSON.stringify(request, null, 2);
        const responseContent = JSON.stringify(responseData, null, 2);

        console.log('📝 Log POST body received:');
        console.log('→ customer_name:', customer_name);
        console.log('→ request:', request);
        console.log('→ response:', responseData);


        const result = await pool.query(
            'INSERT INTO logs (customer_name, request, response) VALUES ($1, $2, $3)',
            [customer_name, requestContent, responseContent]
        );

        return NextResponse.json({ message: 'Log saved successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('❌ Logging error:', error.message);
        return new NextResponse('Logging failed', { status: 500 });
    }
}

