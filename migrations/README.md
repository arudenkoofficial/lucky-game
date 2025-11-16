# Database Migrations

This directory contains SQL migration files that set up the database schema for the Lucky Game slot machine application.

## Quick Start

### Manual SQL Execution

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new)
2. Copy the contents of each migration file in order:
   - `000_migrations_table.sql`
   - `001_initial_schema.sql`
   - `002_fix_view_security.sql` (CRITICAL - fixes security vulnerability)
   - `003_enable_rls_migrations_table.sql`
   - `004_backfill_existing_users.sql` (only if you have existing users)
3. Paste into the SQL Editor and click **RUN**

## Migration Files

### 000_migrations_table.sql
Creates the `_migrations` table to track which migrations have been executed.

### 001_initial_schema.sql
Creates the main database schema for the slot machine game.

### 002_fix_view_security.sql
**CRITICAL SECURITY FIX** - Fixes security vulnerability in views.

This migration addresses a critical security issue where `spin_results_view` and `user_stats_view` were bypassing Row Level Security (RLS) policies. Without this fix, all user data is publicly accessible via API.

**What it fixes:**
- Converts views to use `SECURITY INVOKER` instead of default `SECURITY DEFINER`
- Ensures RLS policies on underlying tables (`spins`, `user_profiles`) are respected
- Prevents unauthorized access to private spin data and statistics

**Impact:**
- Before: Anyone could query all users' spins, rewards, and statistics
- After: Users can only see their own data, respecting RLS policies

### 003_enable_rls_migrations_table.sql
Protects the internal migrations tracking table from public API access by enabling RLS without any policies. This ensures only the service_role can access it.

### 004_backfill_existing_users.sql
**Only needed if you have existing users in auth.users.**

Creates user profiles for any existing authenticated users who don't have a profile yet. This migration:
- Finds all users in `auth.users` without a corresponding `user_profiles` record
- Creates profiles for them with 1000 coins and level 1
- Is safe to run multiple times (uses `ON CONFLICT DO NOTHING`)

**When to use:** If you're adding this migration system to an existing project with registered users, run this migration to ensure all users have profiles.

## Database Schema

### Core Tables

#### user_profiles
Extended user information linked to Supabase Auth.

- `id` (uuid) - References auth.users
- `username` (varchar) - Unique username
- `coins` (integer) - Virtual currency balance (starts at 1000)
- `level` (integer) - Player level (starts at 1)
- `created_at` (timestamptz) - Profile creation date
- `updated_at` (timestamptz) - Last update timestamp

#### symbols
Slot machine reel elements.

- `id` (uuid) - Symbol ID
- `code` (varchar) - Symbol code (CHERRY, SEVEN, DIAMOND, etc.)
- `display_name` (varchar) - Display name (Вишня, Семёрка, Бриллиант)
- `rarity` (enum) - COMMON, RARE, EPIC, LEGENDARY
- `base_value` (integer) - Base value for rewards
- `created_at` (timestamptz) - Creation timestamp

**Default Symbols:**
- CHERRY (Вишня) - COMMON, 10 pts
- LEMON (Лимон) - COMMON, 10 pts
- ORANGE (Апельсин) - COMMON, 15 pts
- PLUM (Слива) - RARE, 25 pts
- BELL (Колокольчик) - RARE, 30 pts
- STAR (Звезда) - EPIC, 50 pts
- SEVEN (Семёрка) - EPIC, 75 pts
- DIAMOND (Бриллиант) - LEGENDARY, 100 pts

#### spin_configurations
User-configured desired spin outcomes.

- `id` (uuid) - Configuration ID
- `user_id` (uuid) - References auth.users
- `desired_combination` (uuid[]) - Array of 3-5 symbol IDs
- `cost` (integer) - Cost to create this configuration
- `status` (enum) - DRAFT, ACTIVE, USED
- `created_at` (timestamptz) - Creation timestamp

#### spins
Actual spin results.

- `id` (uuid) - Spin ID
- `user_id` (uuid) - References auth.users
- `configuration_id` (uuid) - References spin_configurations (nullable)
- `actual_combination` (uuid[]) - Actual symbol combination result
- `is_match` (boolean) - Whether it matched the desired configuration
- `reward` (integer) - Reward amount received
- `executed_at` (timestamptz) - Execution timestamp

#### game_sessions
Groups multiple spins into sessions for analytics.

- `id` (uuid) - Session ID
- `user_id` (uuid) - References auth.users
- `spins_count` (integer) - Number of spins in session
- `total_reward` (integer) - Total rewards in session
- `started_at` (timestamptz) - Session start time
- `ended_at` (timestamptz) - Session end time (nullable)

### Enumerations

- `symbol_rarity`: COMMON, RARE, EPIC, LEGENDARY
- `configuration_status`: DRAFT, ACTIVE, USED

### Indexes

For optimized queries:
- `idx_spins_user_id` - Spins by user
- `idx_spins_executed_at` - Spins by execution time (DESC)
- `idx_game_sessions_user_id` - Sessions by user
- `idx_game_sessions_started_at` - Sessions by start time (DESC)

### Views

#### spin_results_view
Combines spin data with user information for easy querying.

**Security:** Uses `SECURITY INVOKER` to respect RLS policies. Users can only see their own spin results.

#### user_stats_view
Aggregated user statistics:
- Total spins
- Successful spins (matches)
- Total rewards
- Best single reward

**Security:** Uses `SECURITY INVOKER` to respect RLS policies. Users can only see their own statistics.

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

### user_profiles
- **SELECT**: Public (all profiles viewable)
- **UPDATE**: Own profile only
- **INSERT**: Own profile only

### symbols
- **SELECT**: Public (all symbols viewable)

### spin_configurations
- **SELECT**: Own configurations only
- **INSERT**: Own configurations only
- **UPDATE**: Own configurations only

### spins
- **SELECT**: Own spins only
- **INSERT**: Own spins only

### game_sessions
- **SELECT**: Own sessions only
- **INSERT**: Own sessions only
- **UPDATE**: Own sessions only

## Automatic Features

### User Profile Creation
When a new user signs up through Supabase Auth, a user profile is automatically created with:
- Starting coins: 1000
- Starting level: 1

This is handled by the `handle_new_user()` function and `on_auth_user_created` trigger.

### Timestamp Updates
The `user_profiles.updated_at` field is automatically updated on any profile modification via the `handle_updated_at()` function.

## Entity Relationships

```
User (auth.users)
  ├─ user_profiles (1:1)
  ├─ spin_configurations (1:M)
  ├─ spins (1:M)
  └─ game_sessions (1:M)

Symbol
  └─ Used in spin_configurations.desired_combination (M:M)
  └─ Used in spins.actual_combination (M:M)

SpinConfiguration (1) ──> Spin (1)
GameSession (1) ──> Spins (M)
```

## Game Flow

1. **User Registration**: Auto-creates profile with 1000 coins
2. **Create Configuration**: User spends coins to create desired symbol combination
3. **Execute Spin**: System generates actual combination, compares with desired
4. **Calculate Reward**: If match, user receives reward based on symbol values
5. **Update Profile**: Coins and level updated based on results
6. **Track Session**: Spins can be grouped into sessions for analytics

## Troubleshooting

### "Missing environment variables"
Make sure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### "Migrations directory not found"
The migrations folder should be in your project root. If it's missing, create it and add the SQL files.

## Adding New Migrations

1. Create a new file with the next number: `003_your_migration_name.sql`
2. Add your SQL statements following idempotency guidelines (see below)
3. Execute the migration in Supabase SQL Editor

### Idempotency Guidelines

**IMPORTANT:** Not all PostgreSQL commands support `IF NOT EXISTS`. Follow these rules:

✅ **Commands that support IF NOT EXISTS:**
- `CREATE TABLE IF NOT EXISTS`
- `CREATE INDEX IF NOT EXISTS`
- `CREATE SCHEMA IF NOT EXISTS`
- `CREATE EXTENSION IF NOT EXISTS`

❌ **Commands that DO NOT support IF NOT EXISTS:**
- `CREATE POLICY` - Use DO blocks with exception handling
- `CREATE TRIGGER` - Check existence with pg_trigger
- `CREATE TYPE ... AS ENUM` - Use DO blocks with exception handling

**Example - RLS Policy (correct way):**

```sql
DO $$ BEGIN
  CREATE POLICY "Policy name" ON table_name
    FOR SELECT USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
```

For detailed migration guidelines, see [PostgreSQL Migration Guidelines](../docs/POSTGRESQL_MIGRATION_GUIDELINES.md).

## Notes

- Migrations are executed in alphabetical order
- Each migration is tracked in the `_migrations` table
- Migrations that have already been executed will be skipped
- Always test migrations on a development database first
- Use transactions for complex migrations
- **All migrations must be idempotent** - they should be safe to run multiple times
