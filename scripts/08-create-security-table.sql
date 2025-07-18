-- Maak een aparte tabel voor beveiligingsgegevens
-- Dit zorgt voor betere beveiliging en scheiding van gegevens

-- Maak de SecurityQuestion tabel
CREATE TABLE IF NOT EXISTS "SecurityQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answerHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT "SecurityQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Maak unieke index voor userId (één actieve beveiligingsvraag per gebruiker)
CREATE UNIQUE INDEX IF NOT EXISTS "SecurityQuestion_userId_active_idx" ON "SecurityQuestion"("userId") WHERE "isActive" = TRUE;

-- Maak index voor betere performance
CREATE INDEX IF NOT EXISTS "SecurityQuestion_userId_idx" ON "SecurityQuestion"("userId");
CREATE INDEX IF NOT EXISTS "SecurityQuestion_createdAt_idx" ON "SecurityQuestion"("createdAt");

-- Verwijder de oude kolommen uit de User tabel (als ze bestaan)
DO $$
BEGIN
    -- Controleer en verwijder securityQuestion kolom
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'securityQuestion'
    ) THEN
        ALTER TABLE "User" DROP COLUMN "securityQuestion";
        RAISE NOTICE 'securityQuestion kolom verwijderd uit User tabel';
    END IF;

    -- Controleer en verwijder securityAnswer kolom
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'securityAnswer'
    ) THEN
        ALTER TABLE "User" DROP COLUMN "securityAnswer";
        RAISE NOTICE 'securityAnswer kolom verwijderd uit User tabel';
    END IF;
END $$;

-- Verwijder oude index als deze bestaat
DROP INDEX IF EXISTS "User_securityQuestion_idx";

-- Toon de nieuwe tabel structuur
SELECT 'SecurityQuestion tabel aangemaakt!' as status;

-- Toon de kolommen van de nieuwe tabel
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'SecurityQuestion' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Toon de User tabel structuur (zonder security kolommen)
SELECT 'User tabel structuur:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;
