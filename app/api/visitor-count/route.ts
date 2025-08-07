import { NextResponse } from 'next/server';
import { getVisitorCount, incrementVisitorCount } from '@/lib/db';

export async function GET() {
  try {
    const count = await getVisitorCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return NextResponse.json({ error: 'Failed to get visitor count' }, { status: 500 });
  }
}

export async function POST() {
  try {
    await incrementVisitorCount();
    return NextResponse.json({ message: 'Visitor count incremented' });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return NextResponse.json({ error: 'Failed to increment visitor count' }, { status: 500 });
  }
}
