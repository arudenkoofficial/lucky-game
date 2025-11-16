# Database Migrations

This directory contains SQL migration files that set up the database schema for the Lucky Game application.

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
Creates the main database schema:

- **notes** - Example table with sample data (from tutorial)
- **games** - Stores game records (game type, bets, results)
- **user_profiles** - Extended user information (username, balance, statistics)
- **RLS Policies** - Row Level Security for data protection
- **Triggers** - Automatic user profile creation on signup

## Database Schema

### Tables

#### notes
- `id` - Auto-incrementing ID
- `title` - Note text
- `created_at` - Creation timestamp

#### games
- `id` - UUID primary key
- `user_id` - Reference to auth.users
- `game_type` - Type of game played
- `bet_amount` - Amount wagered
- `result_amount` - Amount won/lost
- `status` - Game status
- `created_at` - When game was played

#### user_profiles
- `id` - UUID (references auth.users)
- `username` - Unique username
- `balance` - Current balance (starts at 100.00)
- `total_games` - Number of games played
- `total_won` - Total amount won
- `total_lost` - Total amount lost
- `created_at` - Profile creation date
- `updated_at` - Last update timestamp

## Security

All tables have Row Level Security (RLS) enabled:

- Users can only see their own games
- Users can only update their own profile
- All profiles are publicly viewable (username, stats only)
- Notes are publicly readable (example data)

## Automatic Features

### User Profile Creation
When a new user signs up through Supabase Auth, a user profile is automatically created with:
- Starting balance: $100.00
- All statistics initialized to 0

This is handled by the `handle_new_user()` function and trigger.

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
2. Add your SQL statements
3. Run `npm run db:migrate` to apply

## Notes

- Migrations are executed in alphabetical order
- Each migration is tracked in the `_migrations` table
- Migrations that have already been executed will be skipped
- Always test migrations on a development database first
