-- Verwijder de beveiligingsvragen functionaliteit

-- Verwijder de SecurityQuestion tabel als deze bestaat
DROP TABLE IF EXISTS "SecurityQuestion" CASCADE;

-- Verwijder eventuele overgebleven kolommen uit de User tabel
ALTER TABLE "User" DROP COLUMN IF EXISTS "securityQuestion";
ALTER TABLE "User" DROP COLUMN IF EXISTS "securityAnswer";

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
