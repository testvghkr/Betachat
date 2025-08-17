-- Create app data tables for Material 3 AI Chat

-- Calculator history
CREATE TABLE IF NOT EXISTS "CalculatorHistory" (
  id TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notes with Material 3 styling
CREATE TABLE IF NOT EXISTS "Note" (
  id TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Calendar events
CREATE TABLE IF NOT EXISTS "CalendarEvent" (
  id TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP(3) NOT NULL,
  end_time TIMESTAMP(3) NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Code snippets
CREATE TABLE IF NOT EXISTS "CodeSnippet" (
  id TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Color palettes
CREATE TABLE IF NOT EXISTS "ColorPalette" (
  id TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  colors JSONB NOT NULL, -- Use JSONB for better performance with JSON data
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Game scores
CREATE TABLE IF NOT EXISTS "GameScore" (
  id TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  game_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- App settings with beta mode
CREATE TABLE IF NOT EXISTS "AppSetting" (
  id TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, setting_key)
);

-- File uploads for chat (if needed to be stored in DB)
CREATE TABLE IF NOT EXISTS "ChatFile" (
  id TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES "Chat"(id) ON DELETE CASCADE
);

-- Beta settings
CREATE TABLE IF NOT EXISTS "BetaSetting" (
  user_id TEXT PRIMARY KEY NOT NULL,
  beta_enabled BOOLEAN DEFAULT FALSE,
  enter_to_send BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calculator_history_user_id ON "CalculatorHistory"(user_id);
CREATE INDEX IF NOT EXISTS idx_note_user_id ON "Note"(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_event_user_id ON "CalendarEvent"(user_id);
CREATE INDEX IF NOT EXISTS idx_code_snippet_user_id ON "CodeSnippet"(user_id);
CREATE INDEX IF NOT EXISTS idx_color_palette_user_id ON "ColorPalette"(user_id);
CREATE INDEX IF NOT EXISTS idx_game_score_user_id ON "GameScore"(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_file_user_id ON "ChatFile"(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_file_chat_id ON "ChatFile"(chat_id);

-- This script is no longer relevant as app-specific data tables have been removed.
-- It is kept here for historical context but will not be executed.
