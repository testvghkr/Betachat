-- This script is a consolidated version for initial database setup.
-- It includes all necessary table creations and initial seeding.

-- Create Chat table
CREATE TABLE IF NOT EXISTS "Chat" (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

-- Create Message table
CREATE TABLE IF NOT EXISTS "Message" (
    id TEXT PRIMARY KEY NOT NULL,
    chat_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES "Chat"(id) ON DELETE CASCADE
);

-- Create VisitorCount table
CREATE TABLE IF NOT EXISTS "VisitorCount" (
    id INTEGER PRIMARY KEY NOT NULL,
    count INTEGER NOT NULL DEFAULT 0
);

-- Create User table (placeholder for removed auth)
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

-- Seed initial visitor count if not exists
INSERT INTO "VisitorCount" (id, count)
SELECT 1, 0
WHERE NOT EXISTS (SELECT 1 FROM "VisitorCount" WHERE id = 1);
