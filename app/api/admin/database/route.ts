import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const { action } = await request.json();

  if (action === 'clear_all_data') {
    try {
      // Delete all messages first to satisfy foreign key constraints
      await prisma.message.deleteMany({});
      // Then delete all chats
      await prisma.chat.deleteMany({});
      // Reset visitor count
      await prisma.visitorCount.update({
        where: { id: 1 },
        data: { count: 0 },
      });
      // Delete all placeholder users
      await prisma.user.deleteMany({});

      return NextResponse.json({ success: true, message: 'All data cleared successfully.' });
    } catch (error: any) {
      console.error('Error clearing all data:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  } else if (action === 'get_status') {
    try {
      const chatCount = await prisma.chat.count();
      const messageCount = await prisma.message.count();
      const visitorCount = await prisma.visitorCount.findUnique({ where: { id: 1 } });
      const userCount = await prisma.user.count();

      return NextResponse.json({
        success: true,
        status: {
          chatCount,
          messageCount,
          visitorCount: visitorCount?.count || 0,
          userCount,
        },
      });
    } catch (error: any) {
      console.error('Error getting database status:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  }
}
