# Database Migrations

This directory contains SQL migration files that set up the database schema for the Lucky Game slot machine application.

## Quick Start

### Option 1: Automated Setup (Easiest)

1. Make sure your `.env.local` file has your Supabase credentials
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Visit the migration endpoint:
   ```
   http://localhost:3000/api/migrate
   ```

### Option 2: View SQL Instructions

Run the initialization script to see the SQL commands:

```bash
npm run db:init
```

This will display all SQL migrations that you can copy and paste into the Supabase SQL Editor.

### Option 3: Manual SQL Execution

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new)
2. Copy the contents of each migration file in order:
   - `000_migrations_table.sql`
   - `001_initial_schema.sql`
3. Paste into the SQL Editor and click **RUN**

## Migration Files

### 000_migrations_table.sql
Creates the `_migrations` table to track which migrations have been executed.

### 001_initial_schema.sql
Creates the main database schema for the slot machine game:

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

#### user_stats_view
Aggregated user statistics:
- Total spins
- Successful spins (matches)
- Total rewards
- Best single reward

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
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### "Migrations directory not found"
The migrations folder should be in your project root. If it's missing, create it and add the SQL files.

### "Cannot execute migrations"
If the auto-migration endpoint doesn't work, use the manual SQL execution method via the Supabase Dashboard.

## Adding New Migrations

1. Create a new file with the next number: `002_your_migration_name.sql`
2. Add your SQL statements (use `IF NOT EXISTS` for idempotency)
3. Run `npm run db:migrate` to apply

## Notes

- Migrations are executed in alphabetical order
- Each migration is tracked in the `_migrations` table
- Migrations that have already been executed will be skipped
- Always test migrations on a development database first
- Use transactions for complex migrations
