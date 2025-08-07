-- Create app data tables for Material 3 AI Chat

-- Calculator history
CREATE TABLE IF NOT EXISTS calculator_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    expression VARCHAR(500) NOT NULL,
    result VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes with Material 3 styling
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    color VARCHAR(50) DEFAULT 'purple',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar events
CREATE TABLE IF NOT EXISTS calendar_events (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code snippets
CREATE TABLE IF NOT EXISTS code_snippets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
CREATE TABLE IF NOT EXISTS game_scores (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL,
    game_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- App settings with beta mode
CREATE TABLE IF NOT EXISTS app_settings (
    user_id VARCHAR(255) PRIMARY KEY,
    settings JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX IF NOT EXISTS idx_calculator_history_user_id ON calculator_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_code_snippets_user_id ON code_snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_color_palettes_user_id ON color_palettes(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_files_user_id ON chat_files(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_files_chat_id ON chat_files(chat_id);

-- This script is now redundant as app-specific data tables are removed.
-- Keeping it for historical context if needed.
