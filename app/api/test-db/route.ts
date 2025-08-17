import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection by querying a simple table
    const result = await sql`SELECT COUNT(*) FROM "Chat";`;
    const chatCount = result[0].count;

    return NextResponse.json({ status: 'Database connected', chatCount: Number(chatCount) });
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({ status: 'Database connection failed', error: error.message }, { status: 500 });
  }
}
