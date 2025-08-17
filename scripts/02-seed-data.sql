-- Add some test data to verify everything works

-- Insert a test user (password is "test123" hashed with bcrypt)
INSERT INTO "User" ("id", "email", "name", "password", "created_at", "updated_at")
VALUES (
    gen_random_uuid()::text,
    'test@qrp.com',
    'Test Gebruiker',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrKxQ7u',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Insert another test user
INSERT INTO "User" ("id", "email", "name", "password", "created_at", "updated_at")
VALUES (
    gen_random_uuid()::text,
    'demo@qrp.com',
    'Demo Gebruiker',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrKxQ7u',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Create a test chat for the test user
INSERT INTO "Chat" ("id", "title", "user_id", "created_at", "updated_at")
VALUES (
    gen_random_uuid()::text,
    'Welkom Chat',
    (SELECT id FROM "User" WHERE email = 'test@qrp.com' LIMIT 1),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;

-- Add a welcome message
INSERT INTO "Message" ("id", "content", "role", "chat_id", "created_at")
VALUES (
    gen_random_uuid()::text,
    'Hallo! Welkom bij QRP. Ik ben je AI-assistent en kan je helpen met vragen, code schrijven, huiswerk maken en nog veel meer. Hoe kan ik je vandaag helpen?',
    'assistant',
    (SELECT id FROM "Chat" WHERE title = 'Welkom Chat' LIMIT 1),
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;

-- Seed data for 'chats' table
INSERT INTO "Chat" (id, user_id, title, created_at, updated_at) VALUES
(gen_random_uuid()::text, 'guest_user_1', 'Eerste Chat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid()::text, 'guest_user_1', 'Tweede Chat over AI', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed data for 'messages' table
INSERT INTO "Message" (id, chat_id, role, content, created_at) VALUES
(gen_random_uuid()::text, (SELECT id FROM "Chat" WHERE title = 'Eerste Chat' LIMIT 1), 'user', 'Hallo QRP, hoe gaat het?', CURRENT_TIMESTAMP),
(gen_random_uuid()::text, (SELECT id FROM "Chat" WHERE title = 'Eerste Chat' LIMIT 1), 'assistant', 'Hallo daar! Met mij gaat het goed, dank je! Waar kan ik je vandaag mee helpen?', CURRENT_TIMESTAMP),
(gen_random_uuid()::text, (SELECT id FROM "Chat" WHERE title = 'Tweede Chat over AI' LIMIT 1), 'user', 'Kun je me iets vertellen over AI?', CURRENT_TIMESTAMP),
(gen_random_uuid()::text, (SELECT id FROM "Chat" WHERE title = 'Tweede Chat over AI' LIMIT 1), 'assistant', 'Natuurlijk! AI staat voor Kunstmatige Intelligentie. Het is een breed vakgebied binnen de informatica dat zich richt op het creëren van machines die menselijke intelligentie nabootsen. Denk aan leren, probleemoplossing, patroonherkenning en taalbegrip.', CURRENT_TIMESTAMP);

-- Seed initial visitor count if not exists
INSERT INTO "VisitorCount" (id, count)
SELECT 1, 0
WHERE NOT EXISTS (SELECT 1 FROM "VisitorCount" WHERE id = 1);

-- Verify the data was inserted
SELECT 
    (SELECT COUNT(*) FROM "User") as users_count,
    (SELECT COUNT(*) FROM "Chat") as chats_count,
    (SELECT COUNT(*) FROM "Message") as messages_count;

-- Show the test users
SELECT "id", "email", "name", "created_at" FROM "User";
