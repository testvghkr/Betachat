-- Controleer of de security question kolommen correct zijn toegevoegd
-- en voeg ze toe als ze nog niet bestaan

-- Controleer eerst of de kolommen al bestaan
DO $$
BEGIN
    -- Controleer of securityQuestion kolom bestaat
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'securityQuestion'
    ) THEN
        -- Voeg securityQuestion kolom toe als deze niet bestaat
        ALTER TABLE "User" ADD COLUMN "securityQuestion" TEXT;
        RAISE NOTICE 'securityQuestion kolom toegevoegd';
    ELSE
        RAISE NOTICE 'securityQuestion kolom bestaat al';
    END IF;

    -- Controleer of securityAnswer kolom bestaat
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'securityAnswer'
    ) THEN
        -- Voeg securityAnswer kolom toe als deze niet bestaat
        ALTER TABLE "User" ADD COLUMN "securityAnswer" TEXT;
        RAISE NOTICE 'securityAnswer kolom toegevoegd';
    ELSE
        RAISE NOTICE 'securityAnswer kolom bestaat al';
    END IF;
END $$;

-- Maak index voor betere performance (als deze nog niet bestaat)
CREATE INDEX IF NOT EXISTS "User_securityQuestion_idx" ON "User"("securityQuestion");

-- Toon de huidige tabel structuur
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Toon een bevestigingsbericht
SELECT 'Security questions fix script uitgevoerd!' as status;

-- This script is no longer directly used as authentication is removed.
-- It's kept as a placeholder for historical context.

-- Example of a potential fix (if security_question was added as NOT NULL without a default)
-- ALTER TABLE "User" ALTER COLUMN security_question DROP NOT NULL;
-- ALTER TABLE "User" ALTER COLUMN security_answer DROP NOT NULL;
