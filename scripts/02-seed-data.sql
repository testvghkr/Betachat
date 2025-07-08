-- Add some test data to verify everything works

-- Insert a test user (password is "test123" hashed with bcrypt)
INSERT INTO "User" ("id", "email", "name", "password", "createdAt", "updatedAt")
VALUES (
    'test-user-123',
    'test@qrp.com',
    'Test Gebruiker',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrKxQ7u',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Insert another test user
INSERT INTO "User" ("id", "email", "name", "password", "createdAt", "updatedAt")
VALUES (
    'demo-user-456',
    'demo@qrp.com',
    'Demo Gebruiker',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrKxQ7u',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Create a test chat for the test user
INSERT INTO "Chat" ("id", "title", "description", "userId", "createdAt", "updatedAt")
VALUES (
    'test-chat-123',
    'Welkom Chat',
    'Je eerste chat met QRP',
    'test-user-123',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;

-- Add a welcome message
INSERT INTO "Message" ("id", "content", "role", "chatId", "createdAt")
VALUES (
    'welcome-msg-123',
    'Hallo! Welkom bij QRP. Ik ben je AI-assistent en kan je helpen met vragen, code schrijven, huiswerk maken en nog veel meer. Hoe kan ik je vandaag helpen?',
    'assistant',
    'test-chat-123',
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;

-- Verify the data was inserted
SELECT 
    (SELECT COUNT(*) FROM "User") as users_count,
    (SELECT COUNT(*) FROM "Chat") as chats_count,
    (SELECT COUNT(*) FROM "Message") as messages_count;

-- Show the test users
SELECT "id", "email", "name", "createdAt" FROM "User";
