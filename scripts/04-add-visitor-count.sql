-- Add VisitorCount table if it doesn't exist
CREATE TABLE IF NOT EXISTS "VisitorCount" (
    id INTEGER PRIMARY KEY NOT NULL,
    count INTEGER NOT NULL DEFAULT 0
);

-- Seed initial visitor count if not exists
INSERT INTO "VisitorCount" (id, count)
SELECT 1, 0
WHERE NOT EXISTS (SELECT 1 FROM "VisitorCount" WHERE id = 1);
