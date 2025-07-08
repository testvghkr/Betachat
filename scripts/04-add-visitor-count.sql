-- Add visitor count table for launch celebration

CREATE TABLE IF NOT EXISTS visitor_count (
    id INTEGER PRIMARY KEY DEFAULT 1,
    count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial record
INSERT INTO visitor_count (id, count, updated_at) 
VALUES (1, 0, CURRENT_TIMESTAMP) 
ON CONFLICT (id) DO NOTHING;

-- Verify the table was created
SELECT 'Visitor count table created successfully!' as status;
SELECT * FROM visitor_count;
