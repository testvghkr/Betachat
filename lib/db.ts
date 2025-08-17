import { neon } from '@neondatabase/serverless';
import { generateId } from './utils'; // Import generateId from utils

// Initialize Neon SQL client
export const sql = neon(process.env.DATABASE_URL!);

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
  // You might want to insert into the "User" table if you need to keep track of placeholder users.
  const [result] = await sql`
    INSERT INTO "User" (id, email, name, password, created_at, updated_at)
    VALUES (${generateId()}, ${email}, ${name}, ${hashedPassword}, NOW(), NOW())
    RETURNING id, email, name, password, created_at, updated_at;
  `;
  return result as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  console.warn("getUserByEmail called (placeholder - login removed).");
  const [user] = await sql`SELECT * FROM "User" WHERE email = ${email};`;
  return user as User || null;
}

export async function getUserById(id: string): Promise<User | null> {
  console.warn("getUserById called (placeholder - login removed).");
  const [user] = await sql`SELECT * FROM "User" WHERE id = ${id};`;
  return user as User || null;
}

// --- End of Placeholder functions ---


// Visitor count functions
export async function getVisitorCount(): Promise<number> {
  try {
    const [result] = await sql`SELECT count FROM "VisitorCount" WHERE id = 1;`;
    return result ? Number(result.count) : 0;
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return 0;
  }
}

export async function incrementVisitorCount(): Promise<void> {
  try {
    await sql`
      INSERT INTO "VisitorCount" (id, count) VALUES (1, 1)
      ON CONFLICT (id) DO UPDATE SET count = "VisitorCount".count + 1;
    `;
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
  const [result] = await sql`
    INSERT INTO "Chat" (id, user_id, title, created_at, updated_at)
    VALUES (${generateId()}, ${PLACEHOLDER_USER_ID}, ${title}, NOW(), NOW())
    RETURNING id, user_id, title, created_at, updated_at;
  `;
  return {
    ...result,
    created_at: new Date(result.created_at),
    updated_at: new Date(result.updated_at)
  } as Chat;
}

export async function getChatsByUserId(userId: string = PLACEHOLDER_USER_ID): Promise<Chat[]> {
  const results = await sql`
    SELECT id, user_id, title, created_at, updated_at
    FROM "Chat"
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC;
  `;
  return results.map(row => ({
    ...row,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at)
  })) as Chat[];
}

export async function getChatById(chatId: string): Promise<Chat | null> {
  const [result] = await sql`
    SELECT id, user_id, title, created_at, updated_at
    FROM "Chat"
    WHERE id = ${chatId};
  `;
  return result ? {
    ...result,
    created_at: new Date(result.created_at),
    updated_at: new Date(result.updated_at)
  } as Chat : null;
}

export async function createMessage(chatId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
  const [result] = await sql`
    INSERT INTO "Message" (id, chat_id, role, content, created_at)
    VALUES (${generateId()}, ${chatId}, ${role}, ${content}, NOW())
    RETURNING id, chat_id, role, content, created_at;
  `;
  return {
    ...result,
    created_at: new Date(result.created_at)
  } as Message;
}

export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  const results = await sql`
    SELECT id, chat_id, role, content, created_at
    FROM "Message"
    WHERE chat_id = ${chatId}
    ORDER BY created_at ASC;
  `;
  return results.map(row => ({
    ...row,
    created_at: new Date(row.created_at)
  })) as Message[];
}

export async function deleteChat(id: string): Promise<void> {
  // Messages are automatically deleted due to ON DELETE CASCADE constraint
  await sql`DELETE FROM "Chat" WHERE id = ${id};`;
}
