-- ============================================================================
-- Lucky Game - Initial Database Schema
-- Slot Machine Game with User-Configured Spins
-- ============================================================================

-- Create user_profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username varchar(50) UNIQUE,
  coins integer DEFAULT 1000,          -- виртуальная валюта
  level integer DEFAULT 1,             -- уровень игрока
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
DO $$ BEGIN
  CREATE POLICY "Public profiles are viewable" ON user_profiles
    FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can only update their own profile
DO $$ BEGIN
  CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own profile
DO $$ BEGIN
  CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- Symbols Table - Элементы игрового барабана
-- ============================================================================

-- Create enum for symbol rarity
DO $$ BEGIN
  CREATE TYPE symbol_rarity AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS symbols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(50) UNIQUE NOT NULL,      -- "CHERRY", "SEVEN", "DIAMOND"
  display_name varchar(100) NOT NULL,    -- "Вишня", "Семёрка", "Бриллиант"
  rarity symbol_rarity DEFAULT 'COMMON',
  base_value integer NOT NULL DEFAULT 0, -- базовая ценность символа
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for symbols (public read)
ALTER TABLE symbols ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Symbols are publicly viewable" ON symbols
    FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Insert default symbols
INSERT INTO symbols (code, display_name, rarity, base_value)
VALUES
  ('CHERRY', 'Вишня', 'COMMON', 10),
  ('LEMON', 'Лимон', 'COMMON', 10),
  ('ORANGE', 'Апельсин', 'COMMON', 15),
  ('PLUM', 'Слива', 'RARE', 25),
  ('BELL', 'Колокольчик', 'RARE', 30),
  ('STAR', 'Звезда', 'EPIC', 50),
  ('SEVEN', 'Семёрка', 'EPIC', 75),
  ('DIAMOND', 'Бриллиант', 'LEGENDARY', 100)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- Spin Configurations Table - Конфигурации желаемых результатов
-- ============================================================================

-- Create enum for configuration status
DO $$ BEGIN
  CREATE TYPE configuration_status AS ENUM ('DRAFT', 'ACTIVE', 'USED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS spin_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  desired_combination uuid[] NOT NULL,   -- массив из 3-5 symbol IDs
  cost integer NOT NULL,                 -- стоимость создания конфигурации
  status configuration_status DEFAULT 'ACTIVE',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for spin_configurations
ALTER TABLE spin_configurations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own configurations
DO $$ BEGIN
  CREATE POLICY "Users can view own configurations" ON spin_configurations
    FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own configurations
DO $$ BEGIN
  CREATE POLICY "Users can insert own configurations" ON spin_configurations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can update their own configurations
DO $$ BEGIN
  CREATE POLICY "Users can update own configurations" ON spin_configurations
    FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- Spins Table - Результаты спинов
-- ============================================================================

CREATE TABLE IF NOT EXISTS spins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  configuration_id uuid REFERENCES spin_configurations(id) ON DELETE SET NULL,
  actual_combination uuid[] NOT NULL,    -- фактическая комбинация символов
  is_match boolean DEFAULT false,        -- совпала ли с желаемой
  reward integer DEFAULT 0,              -- полученная награда
  executed_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_spins_user_id ON spins(user_id);
CREATE INDEX IF NOT EXISTS idx_spins_executed_at ON spins(executed_at DESC);

-- Enable RLS for spins
ALTER TABLE spins ENABLE ROW LEVEL SECURITY;

-- Users can only see their own spins
DO $$ BEGIN
  CREATE POLICY "Users can view own spins" ON spins
    FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own spins
DO $$ BEGIN
  CREATE POLICY "Users can insert own spins" ON spins
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- Game Sessions Table - Группировка спинов в сессии
-- ============================================================================

CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  spins_count integer DEFAULT 0,
  total_reward integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_started_at ON game_sessions(started_at DESC);

-- Enable RLS for game_sessions
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
DO $$ BEGIN
  CREATE POLICY "Users can view own sessions" ON game_sessions
    FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own sessions
DO $$ BEGIN
  CREATE POLICY "Users can insert own sessions" ON game_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can update their own sessions
DO $$ BEGIN
  CREATE POLICY "Users can update own sessions" ON game_sessions
    FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- Triggers and Functions
-- ============================================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, coins, level)
  VALUES (new.id, 1000, 1); -- Starting coins and level
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Function to update user_profiles updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_user_profile_updated'
  ) THEN
    CREATE TRIGGER on_user_profile_updated
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- ============================================================================
-- Helper Views (Optional)
-- ============================================================================

-- View for spin results with symbol details
CREATE OR REPLACE VIEW spin_results_view AS
SELECT
  s.id,
  s.user_id,
  s.configuration_id,
  s.is_match,
  s.reward,
  s.executed_at,
  s.actual_combination,
  u.username,
  u.level
FROM spins s
LEFT JOIN user_profiles u ON s.user_id = u.id;

-- View for user statistics
CREATE OR REPLACE VIEW user_stats_view AS
SELECT
  up.id,
  up.username,
  up.coins,
  up.level,
  COUNT(s.id) as total_spins,
  SUM(CASE WHEN s.is_match THEN 1 ELSE 0 END) as successful_spins,
  SUM(s.reward) as total_rewards,
  MAX(s.reward) as best_reward
FROM user_profiles up
LEFT JOIN spins s ON up.id = s.user_id
GROUP BY up.id, up.username, up.coins, up.level;
