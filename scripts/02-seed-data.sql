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

-- Seed data for 'chats' table
INSERT INTO "Chat" (user_id, title) VALUES
('guest_user_1', 'Eerste Chat'),
('guest_user_1', 'Tweede Chat over AI');

-- Seed data for 'messages' table
INSERT INTO "Message" (chat_id, role, content) VALUES
((SELECT id FROM "Chat" WHERE title = 'Eerste Chat' LIMIT 1), 'user', 'Hallo QRP, hoe gaat het?'),
((SELECT id FROM "Chat" WHERE title = 'Eerste Chat' LIMIT 1), 'assistant', 'Hallo daar! Met mij gaat het goed, dank je! Waar kan ik je vandaag mee helpen?'),
((SELECT id FROM "Chat" WHERE title = 'Tweede Chat over AI' LIMIT 1), 'user', 'Kun je me iets vertellen over AI?'),
((SELECT id FROM "Chat" WHERE title = 'Tweede Chat over AI' LIMIT 1), 'assistant', 'Natuurlijk! AI staat voor Kunstmatige Intelligentie. Het is een breed vakgebied binnen de informatica dat zich richt op het creëren van machines die menselijke intelligentie nabootsen. Denk aan leren, probleemoplossing, patroonherkenning en taalbegrip.');

-- Seed initial visitor count if not exists
INSERT INTO "VisitorCount" (id, count)
SELECT 1, 0
WHERE NOT EXISTS (SELECT 1 FROM "VisitorCount" WHERE id = 1);

-- This script is now redundant as we don't have specific seed data for this simplified version.
-- Keeping it for historical context if needed.

-- Verify the data was inserted
SELECT 
    (SELECT COUNT(*) FROM "User") as users_count,
    (SELECT COUNT(*) FROM "Chat") as chats_count,
    (SELECT COUNT(*) FROM "Message") as messages_count;

-- Show the test users
SELECT "id", "email", "name", "createdAt" FROM "User";
