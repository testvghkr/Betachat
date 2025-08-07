-- Add security questions to User table for secure password reset

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "securityQuestion" TEXT,
ADD COLUMN IF NOT EXISTS "securityAnswer" TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS "User_securityQuestion_idx" ON "User"("securityQuestion");

-- This script is now redundant as security questions are removed.
-- Keeping it for historical context if needed.

-- Verify the changes
SELECT 'Security questions fields added successfully!' as status;

-- Show updated table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;
