-- Create app data tables for Material 3 AI Chat

-- Calculator history
CREATE TABLE IF NOT EXISTS "CalculatorHistory" (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    expression TEXT NOT NULL,
    result TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notes with Material 3 styling
CREATE TABLE IF NOT EXISTS "Note" (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

-- Calendar events
CREATE TABLE IF NOT EXISTS "CalendarEvent" (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP(3) NOT NULL,
    end_time TIMESTAMP(3) NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

-- Code snippets
CREATE TABLE IF NOT EXISTS "CodeSnippet" (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    language TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

-- Color palettes
CREATE TABLE IF NOT EXISTS color_palettes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    colors JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game scores
CREATE TABLE IF NOT EXISTS "GameScore" (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    game_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- App settings with beta mode
CREATE TABLE IF NOT EXISTS "AppSetting" (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,
    UNIQUE (user_id, setting_key)
);

-- File uploads for chat
CREATE TABLE IF NOT EXISTS chat_files (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    chat_id VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beta settings
CREATE TABLE IF NOT EXISTS beta_settings (
    user_id VARCHAR(255) PRIMARY KEY,
    beta_enabled BOOLEAN DEFAULT FALSE,
    enter_to_send BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calculator_history_user_id ON "CalculatorHistory"(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON "Note"(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON "CalendarEvent"(user_id);
CREATE INDEX IF NOT EXISTS idx_code_snippets_user_id ON "CodeSnippet"(user_id);
CREATE INDEX IF NOT EXISTS idx_color_palettes_user_id ON color_palettes(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON "GameScore"(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_files_user_id ON chat_files(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_files_chat_id ON chat_files(chat_id);

-- This script is no longer directly used as app-specific features are removed.
-- It's kept as a placeholder for historical context.
