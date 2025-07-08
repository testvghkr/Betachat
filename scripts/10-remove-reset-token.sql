-- Verwijder de reset token functionaliteit

-- Verwijder de reset token kolommen uit de User tabel
ALTER TABLE "User" DROP COLUMN IF EXISTS "resetToken";
ALTER TABLE "User" DROP COLUMN IF EXISTS "resetTokenExpires";

-- Verwijder eventuele indexen
DROP INDEX IF EXISTS "User_resetToken_idx";

-- Toon de huidige User tabel structuur
SELECT 'User tabel structuur na verwijderen reset token:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '✅ Reset token functionaliteit succesvol verwijderd!' as status;
