-- Create notes table (from tutorial example)
CREATE TABLE IF NOT EXISTS notes (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to notes
CREATE POLICY IF NOT EXISTS "Allow public read access" ON notes
  FOR SELECT
  USING (true);

-- Insert sample data if table is empty
INSERT INTO notes(title)
SELECT * FROM (VALUES
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!')
) AS sample_notes
WHERE NOT EXISTS (SELECT 1 FROM notes);

-- Create games table for lucky game
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type varchar(50) NOT NULL,
  bet_amount numeric(10, 2),
  result_amount numeric(10, 2),
  status varchar(20) DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for games
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Users can only see their own games
CREATE POLICY IF NOT EXISTS "Users can view own games" ON games
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own games
CREATE POLICY IF NOT EXISTS "Users can insert own games" ON games
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create user_profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username varchar(50) UNIQUE,
  balance numeric(10, 2) DEFAULT 0,
  total_games integer DEFAULT 0,
  total_won numeric(10, 2) DEFAULT 0,
  total_lost numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY IF NOT EXISTS "Public profiles are viewable" ON user_profiles
  FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, balance)
  VALUES (new.id, 100.00); -- Starting balance
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create profile on user signup (only if not exists)
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
