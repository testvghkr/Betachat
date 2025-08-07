import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';

// Declare a global variable for PrismaClient to prevent multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize PrismaClient
export const prisma = global.prisma || new PrismaClient();

// Initialize Neon SQL client
export const sql = neon(process.env.DATABASE_URL!);

// In development, store the PrismaClient instance globally
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// --- Placeholder functions for previous auth/user related exports ---
// These are included to satisfy the build process if other parts of the system
// (e.g., cached references or build tools) still expect them, even though
// login functionality has been removed. They do not provide actual user management.

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export async function createUser(email: string, name: string, hashedPassword: string): Promise<User> {
  console.warn("createUser called (placeholder - login removed).");
  // This function is a placeholder. It will not create a real user for login.
  return {
    id: generateId(),
    email,
    name,
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  console.warn("getUserByEmail called (placeholder - login removed).");
  return null; // Always return null as no real users are managed for login
}

export async function getUserById(id: string): Promise<User | null> {
  console.warn("getUserById called (placeholder - login removed).");
  return null; // Always return null as no real users are managed for login
}

// --- End of Placeholder functions ---


// Placeholder for visitor count functions
export async function getVisitorCount(): Promise<number> {
  try {
    const result = await prisma.visitorCount.findFirst();
    return result?.count || 0;
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return 0;
  }
}

export async function incrementVisitorCount(): Promise<void> {
  try {
    await prisma.visitorCount.upsert({
      where: { id: 1 },
      update: { count: { increment: 1 } },
      create: { id: 1, count: 1 },
    });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
  }
}

export interface Chat {
  id: string;
  user_id: string; // This will be a placeholder user ID since login is removed
  title: string;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

// Placeholder user ID for all chats since login is removed
const PLACEHOLDER_USER_ID = 'qrp_guest_user';

export async function createChat(title: string): Promise<Chat> {
  const result = await prisma.chat.create({
    data: {
      id: generateId(),
      user_id: PLACEHOLDER_USER_ID,
      title: title,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  return result as Chat;
}

export async function getChatsByUserId(userId: string = PLACEHOLDER_USER_ID): Promise<Chat[]> {
  const result = await prisma.chat.findMany({
    where: { user_id: userId },
    orderBy: { updated_at: 'desc' },
  });
  return result as Chat[];
}

export async function getChatById(chatId: string): Promise<Chat | null> {
  const result = await prisma.chat.findUnique({
    where: { id: chatId },
  });
  return result as Chat || null;
}

export async function createMessage(chatId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
  const result = await prisma.message.create({
    data: {
      id: generateId(),
      chat_id: chatId,
      role: role,
      content: content,
      created_at: new Date(),
    },
  });
  return result as Message;
}

export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  const result = await prisma.message.findMany({
    where: { chat_id: chatId },
    orderBy: { created_at: 'asc' },
  });
  return result as Message[];
}

export async function deleteChat(id: string): Promise<void> {
  await prisma.message.deleteMany({
    where: { chat_id: id },
  }); // Delete associated messages first
  await prisma.chat.delete({
    where: { id: id },
  });
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
