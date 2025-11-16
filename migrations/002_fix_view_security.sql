-- ============================================================================
-- Fix Security Issue: Views bypassing RLS policies
-- ============================================================================
--
-- ISSUE: spin_results_view and user_stats_view were created without explicit
-- security settings, causing them to run as SECURITY DEFINER (view owner's
-- privileges). This bypasses RLS policies on underlying tables, exposing
-- all users' data publicly via API.
--
-- SOLUTION: Recreate views with SECURITY INVOKER to respect RLS policies
-- ============================================================================

-- Drop and recreate spin_results_view with SECURITY INVOKER
DROP VIEW IF EXISTS spin_results_view;

CREATE VIEW spin_results_view
WITH (security_invoker = true) AS
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

-- Drop and recreate user_stats_view with SECURITY INVOKER
DROP VIEW IF EXISTS user_stats_view;

CREATE VIEW user_stats_view
WITH (security_invoker = true) AS
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

-- ============================================================================
-- Security Verification
-- ============================================================================
--
-- With SECURITY INVOKER enabled:
--
-- 1. spin_results_view will now respect the RLS policy on 'spins' table:
--    - Users can only see their own spins (auth.uid() = user_id)
--
-- 2. user_stats_view will now respect RLS policies:
--    - user_profiles: publicly viewable (true)
--    - spins: users can only see own spins (auth.uid() = user_id)
--    - Result: Users see stats only for themselves, but can see other users'
--      public profile info (username, coins, level) without spin details
--
-- This properly restricts sensitive data while maintaining necessary
-- public information accessibility.
-- ============================================================================
