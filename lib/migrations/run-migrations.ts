import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface Migration {
  name: string;
  sql: string;
}

/**
 * Run database migrations
 * This function reads all SQL files from the migrations directory
 * and executes them in order if they haven't been run before
 */
export async function runMigrations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('⚠️  Missing Supabase environment variables');
    console.error('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔄 Starting database migrations...');

    // Read all migration files
    const migrationsDir = join(process.cwd(), 'migrations');
    const files = await readdir(migrationsDir);
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort alphabetically to ensure order

    if (sqlFiles.length === 0) {
      console.log('ℹ️  No migration files found');
      return true;
    }

    console.log(`📂 Found ${sqlFiles.length} migration file(s)`);

    // Read and prepare migrations
    const migrations: Migration[] = [];
    for (const file of sqlFiles) {
      const filePath = join(migrationsDir, file);
      const sql = await readFile(filePath, 'utf-8');
      migrations.push({ name: file, sql });
    }

    // Execute migrations
    for (const migration of migrations) {
      try {
        console.log(`   Running: ${migration.name}`);

        // Check if migration was already executed
        const { data: existing } = await supabase
          .from('_migrations')
          .select('name')
          .eq('name', migration.name)
          .maybeSingle();

        if (existing) {
          console.log(`   ✓ Skipped: ${migration.name} (already executed)`);
          continue;
        }

        // Execute migration SQL
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql_query: migration.sql
        });

        // If RPC doesn't exist, we need to execute via raw SQL
        // Note: Supabase doesn't allow arbitrary SQL execution from client by default
        // You need to create a stored procedure or use Supabase Management API
        if (sqlError && sqlError.message.includes('function public.exec_sql')) {
          console.log(`   ⚠️  Direct SQL execution not available`);
          console.log(`   ℹ️  Please run migrations manually via Supabase Dashboard SQL Editor`);
          console.log(`   📄 Migration file: migrations/${migration.name}`);
          continue;
        } else if (sqlError) {
          throw sqlError;
        }

        // Record migration as executed
        const { error: insertError } = await supabase
          .from('_migrations')
          .insert({ name: migration.name });

        if (insertError) {
          console.log(`   ⚠️  Warning: Could not record migration: ${insertError.message}`);
        } else {
          console.log(`   ✓ Completed: ${migration.name}`);
        }

      } catch (error) {
        console.error(`   ✗ Failed: ${migration.name}`);
        console.error(`   Error:`, error);
        // Continue with next migration instead of stopping
      }
    }

    console.log('✅ Database migrations check completed\n');
    return true;

  } catch (error) {
    console.error('❌ Migration error:', error);
    return false;
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
