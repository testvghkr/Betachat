-- Add email verification fields to User table

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "verificationToken" TEXT,
ADD COLUMN IF NOT EXISTS "verificationTokenExpires" TIMESTAMP(3);

-- Create index for verification token
CREATE INDEX IF NOT EXISTS "User_verificationToken_idx" ON "User"("verificationToken");

-- Update existing users to be verified (for migration)
UPDATE "User" SET "emailVerified" = TRUE WHERE "emailVerified" IS NULL;

-- Verify the changes
SELECT 'Email verification fields added successfully!' as status;

-- Show updated table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;
