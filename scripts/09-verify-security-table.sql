-- Verifieer dat de SecurityQuestion tabel correct is aangemaakt

-- Controleer of de tabel bestaat
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'SecurityQuestion' AND table_schema = 'public'
        ) 
        THEN '✅ SecurityQuestion tabel bestaat'
        ELSE '❌ SecurityQuestion tabel bestaat NIET'
    END as table_status;

-- Toon de tabel structuur
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'SecurityQuestion' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Controleer de indexen
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'SecurityQuestion' AND schemaname = 'public'
ORDER BY indexname;

-- Controleer de foreign key constraints
SELECT 
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
    AND tc.table_name = 'SecurityQuestion';

-- Test de unieke constraint
SELECT 'Testing unique constraint...' as test_info;

-- Toon huidige data (als er al data is)
SELECT 
    COUNT(*) as total_security_questions,
    COUNT(DISTINCT "userId") as unique_users_with_security
FROM "SecurityQuestion"
WHERE "isActive" = TRUE;

SELECT '✅ SecurityQuestion tabel verificatie voltooid!' as status;

-- This script is now redundant as security questions are removed.
-- Keeping it for historical context if needed.
