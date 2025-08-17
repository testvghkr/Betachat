import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  const { action } = await request.json();

  if (action === 'clear_all_data') {
    try {
      // Delete all messages first to satisfy foreign key constraints
      await sql`DELETE FROM "Message";`;
      // Then delete all chats
      await sql`DELETE FROM "Chat";`;
      // Reset visitor count
      await sql`UPDATE "VisitorCount" SET count = 0 WHERE id = 1;`;
      // Delete all placeholder users
      await sql`DELETE FROM "User";`;

      return NextResponse.json({ success: true, message: 'All data cleared successfully.' });
    } catch (error: any) {
      console.error('Error clearing all data:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  } else if (action === 'get_status') {
    try {
      const chatCountResult = await sql`SELECT COUNT(*) FROM "Chat";`;
      const messageCountResult = await sql`SELECT COUNT(*) FROM "Message";`;
      const visitorCountResult = await sql`SELECT count FROM "VisitorCount" WHERE id = 1;`;
      const userCountResult = await sql`SELECT COUNT(*) FROM "User";`;

      return NextResponse.json({
        success: true,
        status: {
          chatCount: Number(chatCountResult[0].count),
          messageCount: Number(messageCountResult[0].count),
          visitorCount: Number(visitorCountResult[0]?.count || 0),
          userCount: Number(userCountResult[0].count),
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
