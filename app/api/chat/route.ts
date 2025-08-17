import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/google-ai';
import { createChat, createMessage, getMessagesByChatId, getChatById } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON body
    const body = await req.json();
    const prompt = body.prompt as string;
    const fileUrl = body.fileUrl as string | undefined;
    const fileName = body.fileName as string | undefined;

    if (!prompt && !fileUrl) {
      return NextResponse.json({ error: 'Geen prompt of bestand ontvangen' }, { status: 400 });
    }

    // Placeholder for user ID - since authentication is removed, we use a generic ID
    const userId = 'qrp_guest_user';

    // Fetch chat and messages from database based on provided chat ID or create a new one
    let chatId: string;
    const incomingChatId = req.headers.get('chat-id');
    let chatMessages: any[] = [];

    if (incomingChatId) {
      const existingChat = await getChatById(incomingChatId);
      if (!existingChat) {
        return NextResponse.json({ error: 'Chat niet gevonden' }, { status: 404 });
      }
      chatId = existingChat.id;
      chatMessages = await getMessagesByChatId(chatId);
    } else {
      // Create a new chat with a generated title
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
  }
}
