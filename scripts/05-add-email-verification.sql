-- This script is no longer directly used as authentication is removed.
-- However, if the User table exists, it would add a verification status.
-- For consistency with previous state, keeping it as a placeholder.

-- Add is_verified column to User table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'is_verified') THEN
        ALTER TABLE "User" ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END $$;

-- Add verification_token column to User table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'verification_token') THEN
        ALTER TABLE "User" ADD COLUMN verification_token TEXT;
    END IF;
END $$;

-- Add verification_token_expires_at column to User table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'verification_token_expires_at') THEN
        ALTER TABLE "User" ADD COLUMN verification_token_expires_at TIMESTAMP(3);
    END IF;
END $$;
