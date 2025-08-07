-- Create the 'chats' table
CREATE TABLE IF NOT EXISTS chats (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- Placeholder user ID
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'messages' table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);

-- Create a placeholder 'users' table if it's expected by Prisma, but it won't be used for authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a placeholder 'VisitorCount' table if expected by Prisma
CREATE TABLE IF NOT EXISTS "VisitorCount" (
    id SERIAL PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
);

-- Insert initial visitor count if table is empty
INSERT INTO "VisitorCount" (count)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM "VisitorCount");
