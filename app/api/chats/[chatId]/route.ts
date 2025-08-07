import { NextResponse } from 'next/server';
import { getChatById, getMessagesByChatId, deleteChat } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { chatId: string } }) {
  const { chatId } = params;

  try {
    const chat = await getChatById(chatId);
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const messages = await getMessagesByChatId(chatId);

    return NextResponse.json({ chat, messages });
  } catch (error: any) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch chat' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { chatId: string } }) {
  const { chatId } = params;

  try {
    await deleteChat(chatId);
    return NextResponse.json({ message: 'Chat deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete chat' }, { status: 500 });
  }
}
