import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection by querying a simple table or performing a basic operation
    // For example, try to find the first chat entry
    const firstChat = await prisma.chat.findFirst();

    if (firstChat) {
      return NextResponse.json({ status: 'Database connected and data found', data: firstChat });
    } else {
      return NextResponse.json({ status: 'Database connected, no chat data found' });
    }
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({ status: 'Database connection failed', error: error.message }, { status: 500 });
  }
}
