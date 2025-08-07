-- Verify database setup is working correctly

-- Check if all tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('User', 'Chat', 'Message')
ORDER BY table_name;

-- Check table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('User', 'Chat', 'Message')
ORDER BY table_name, ordinal_position;

-- Check foreign key constraints
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('User', 'Chat', 'Message');

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('User', 'Chat', 'Message')
ORDER BY tablename, indexname;

-- Show current data counts
SELECT 
    'User' as table_name, COUNT(*) as record_count FROM "User"
UNION ALL
SELECT 
    'Chat' as table_name, COUNT(*) as record_count FROM "Chat"
UNION ALL
SELECT 
    'Message' as table_name, COUNT(*) as record_count FROM "Message";

-- Test a simple join to verify relationships work
SELECT 
    u."name" as user_name,
    u."email" as user_email,
    c."title" as chat_title,
    COUNT(m."id") as message_count
FROM "User" u
LEFT JOIN "Chat" c ON u."id" = c."userId"
LEFT JOIN "Message" m ON c."id" = m."chatId"
GROUP BY u."id", u."name", u."email", c."id", c."title"
ORDER BY u."name";

-- This script is now redundant as we don't have specific verification steps for this simplified version.
-- Keeping it for historical context if needed.

SELECT '✅ Database setup verification complete!' as status;
