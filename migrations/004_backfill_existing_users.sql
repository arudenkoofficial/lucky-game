-- ============================================================================
-- Backfill user profiles for existing auth.users
-- ============================================================================
-- Эта миграция создаёт профили для всех пользователей, которые уже существуют
-- в auth.users, но не имеют записи в user_profiles

-- Insert profiles for existing users who don't have one yet
INSERT INTO public.user_profiles (id, coins, level)
SELECT
  au.id,
  1000,  -- Starting coins
  1      -- Starting level
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL  -- Only users without a profile
ON CONFLICT (id) DO NOTHING;

-- Log the migration
INSERT INTO _migrations (name)
VALUES ('002_backfill_existing_users')
ON CONFLICT (name) DO NOTHING;
