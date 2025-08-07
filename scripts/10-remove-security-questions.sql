-- Verwijder de beveiligingsvragen functionaliteit

-- Remove security_question and security_answer columns from User table if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'security_question') THEN
        ALTER TABLE "User" DROP COLUMN security_question;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'security_answer') THEN
        ALTER TABLE "User" DROP COLUMN security_answer;
    END IF;
END $$;

-- Verwijder de SecurityQuestion tabel als deze bestaat
DROP TABLE IF EXISTS "SecurityQuestion";

-- Verwijder eventuele indexen
DROP INDEX IF EXISTS "User_securityQuestion_idx";
DROP INDEX IF EXISTS "SecurityQuestion_userId_idx";
DROP INDEX IF EXISTS "SecurityQuestion_createdAt_idx";
DROP INDEX IF EXISTS "SecurityQuestion_userId_active_idx";

-- Voeg een resetToken kolom toe aan de User tabel voor eenvoudige wachtwoord reset
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetTokenExpires" TIMESTAMP(3);

-- Maak een index voor de resetToken voor betere performance
CREATE INDEX IF NOT EXISTS "User_resetToken_idx" ON "User"("resetToken");

-- Toon de huidige User tabel structuur
SELECT 'User tabel structuur na verwijderen beveiligingsvragen:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '✅ Beveiligingsvragen succesvol verwijderd!' as status;

-- This script is no longer directly used as authentication is removed.
-- It's kept as a placeholder for historical context.
