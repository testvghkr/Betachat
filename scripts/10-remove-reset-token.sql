-- Verwijder de reset token functionaliteit

-- This script is no longer directly used as authentication is removed.
-- It's kept as a placeholder for historical context.

-- Remove reset_token and reset_token_expires_at columns from User table if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'reset_token') THEN
        ALTER TABLE "User" DROP COLUMN reset_token;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'reset_token_expires_at') THEN
        ALTER TABLE "User" DROP COLUMN reset_token_expires_at;
    END IF;
END $$;

-- Verwijder eventuele indexen
DROP INDEX IF EXISTS "User_resetToken_idx";

-- Toon de huidige User tabel structuur
SELECT 'User tabel structuur na verwijderen reset token:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '✅ Reset token functionaliteit succesvol verwijderd!' as status;
