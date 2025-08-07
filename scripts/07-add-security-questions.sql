-- This script is no longer directly used as authentication is removed.
-- It's kept as a placeholder for historical context.

-- Add security_question and security_answer columns to User table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'security_question') THEN
        ALTER TABLE "User" ADD COLUMN security_question TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'security_answer') THEN
        ALTER TABLE "User" ADD COLUMN security_answer TEXT;
    END IF;
END $$;
