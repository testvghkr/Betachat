import { NextResponse } from 'next/server';
import { getVisitorCount, incrementVisitorCount } from '@/lib/db';

export async function GET() {
  try {
    const count = await getVisitorCount();
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Error fetching visitor count:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch visitor count' }, { status: 500 });
  }
}

export async function POST() {
  try {
    await incrementVisitorCount();
    const newCount = await getVisitorCount(); // Fetch updated count
    return NextResponse.json({ newCount });
  } catch (error: any) {
    console.error('Error incrementing visitor count:', error);
    return NextResponse.json({ error: error.message || 'Failed to increment visitor count' }, { status: 500 });
  }
}
