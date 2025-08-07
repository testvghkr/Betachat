import { PrismaClient } from '@prisma/client'
import { neon } from "@neondatabase/serverless"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const sql = neon(process.env.DATABASE_URL!)

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { sql }

export async function createTables() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        is_guest BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create chats table
    await sql`
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create visitor_count table
    await sql`
      CREATE TABLE IF NOT EXISTS visitor_count (
        id SERIAL PRIMARY KEY,
        count INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create user_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        beta_enabled BOOLEAN DEFAULT FALSE,
        enter_to_send BOOLEAN DEFAULT TRUE,
        theme VARCHAR(50) DEFAULT 'system',
        language VARCHAR(10) DEFAULT 'nl',
        notifications_enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `

    // Create app data tables
    await sql`
      CREATE TABLE IF NOT EXISTS calculator_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        expression VARCHAR(255) NOT NULL,
        result VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS code_snippets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        code TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS game_scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        game_name VARCHAR(100) NOT NULL,
        score INTEGER NOT NULL,
        level INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Initialize visitor count if not exists
    const visitorCount = await sql`SELECT count FROM visitor_count LIMIT 1`
    if (visitorCount.length === 0) {
      await sql`INSERT INTO visitor_count (count) VALUES (0)`
    }

    return true
  } catch (error) {
    console.error("Error creating tables:", error)
    return false
  }
}

export async function getVisitorCount() {
  try {
    await createTables()
    const result = await sql`SELECT count FROM visitor_count LIMIT 1`
    return result[0]?.count || 0
  } catch (error) {
    console.error("Error getting visitor count:", error)
    return Math.floor(Math.random() * 1000) + 100
  }
}

export async function incrementVisitorCount() {
  try {
    await createTables()
    await sql`
      UPDATE visitor_count 
      SET count = count + 1, updated_at = CURRENT_TIMESTAMP
    `
    return await getVisitorCount()
  } catch (error) {
    console.error("Error incrementing visitor count:", error)
    return Math.floor(Math.random() * 1000) + 100
  }
}

export async function getUserChats(userId: number) {
  try {
    const result = await sql`
      SELECT id, title, created_at, updated_at
      FROM chats 
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `
    return result
  } catch (error) {
    console.error("Error getting user chats:", error)
    return []
  }
}

export async function createChat(userId: number, title: string) {
  try {
    const result = await sql`
      INSERT INTO chats (user_id, title)
      VALUES (${userId}, ${title})
      RETURNING id, title, created_at, updated_at
    `
    return result[0]
  } catch (error) {
    console.error("Error creating chat:", error)
    throw error
  }
}

export async function getChatMessages(chatId: number, userId: number) {
  try {
    const result = await sql`
      SELECT m.id, m.content, m.role, m.created_at
      FROM messages m
      JOIN chats c ON m.chat_id = c.id
      WHERE m.chat_id = ${chatId} AND c.user_id = ${userId}
      ORDER BY m.created_at ASC
    `
    return result
  } catch (error) {
    console.error("Error getting chat messages:", error)
    return []
  }
}

export async function createMessage(chatId: number, content: string, role: "user" | "assistant") {
  try {
    const result = await sql`
      INSERT INTO messages (chat_id, content, role)
      VALUES (${chatId}, ${content}, ${role})
      RETURNING id, content, role, created_at
    `
    return result[0]
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
}
