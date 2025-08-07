import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/google-ai';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
import { createChat, createMessage, getMessagesByChatId, getChatById } from '@/lib/db';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const file = formData.get('file') as File | null;

    if (!prompt && !file) {
      return NextResponse.json({ error: 'Geen prompt of bestand ontvangen' }, { status: 400 });
    }

    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (file) {
      // Upload file to Vercel Blob storage
      const blob = await put(file.name, file, { access: 'public' });
      fileUrl = blob.url;
      fileName = file.name;
      console.log(`Bestand geüpload naar Vercel Blob: ${fileUrl}`);
    }

    // Placeholder for user ID - since authentication is removed, we use a generic ID
    const userId = 'guest_user';

    // Fetch chat and messages from database based on provided chat ID or create a new one
    let chatId: string;
    const incomingChatId = req.headers.get('chat-id');
    let chatMessages: any[] = [];

    if (incomingChatId) {
      const existingChat = await getChatById(incomingChatId);
      if (!existingChat) {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
      }
      chatId = existingChat.id;
      chatMessages = await getMessagesByChatId(chatId);
    } else {
      const newChat = await createChat(prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''));
      chatId = newChat.id;
    }

    // Add user message to DB
    await createMessage(chatId, 'user', prompt);

    // Prepare history for the AI model
    const aiHistory = chatMessages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: msg.content,
    }));

    // Add the current user message to the history for the AI model
    aiHistory.push({ role: 'user', content: prompt });

    // Generate AI response
    const aiResponse = await generateResponse(prompt, aiHistory);

    // Add assistant message to DB
    await createMessage(chatId, 'assistant', aiResponse);

    return NextResponse.json({ response: aiResponse, fileUrl, fileName, chatId });
  } catch (error: any) {
    console.error('Fout in chat API:', error);
    return NextResponse.json({ error: error.message || 'Interne serverfout' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
