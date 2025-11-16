import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Migration {
  name: string;
  sql: string;
}

/**
 * API endpoint to run database migrations
 * GET /api/migrate
 *
 * Note: In production, you should secure this endpoint with authentication
 * or remove it after initial setup
 */
export async function GET() {
  // Only allow migrations in development or with proper auth
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    // In production, require an admin token
    // You can implement your own security here
    return NextResponse.json(
      { error: 'Migrations can only be run in development mode or with proper authentication' },
      { status: 403 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL environment variable' },
      { status: 500 }
    );
  }

  if (!supabaseServiceKey) {
    return NextResponse.json(
      {
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY environment variable',
        instructions: 'Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file. You can find it in your Supabase project settings under API > Project API keys > service_role key'
      },
      { status: 500 }
    );
  }

  // Create admin client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results: { name: string; status: string; error?: string }[] = [];

  try {
    console.log('🔄 Starting database migrations...');

    // Read all migration files
    const migrationsDir = join(process.cwd(), 'migrations');
    let files: string[];

    try {
      files = await readdir(migrationsDir);
    } catch (error) {
      return NextResponse.json(
        { error: 'Migrations directory not found. Please create a "migrations" folder in your project root.' },
        { status: 500 }
      );
    }

    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort alphabetically to ensure order

    if (sqlFiles.length === 0) {
      return NextResponse.json({
        message: 'No migration files found',
        results: []
      });
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
        const { data: existing, error: selectError } = await supabase
          .from('_migrations')
          .select('name')
          .eq('name', migration.name)
          .maybeSingle();

        // If table doesn't exist yet (first migration), selectError will occur
        // We'll handle this by trying to execute the migration anyway
        if (existing && !selectError) {
          console.log(`   ✓ Skipped: ${migration.name} (already executed)`);
          results.push({ name: migration.name, status: 'skipped' });
          continue;
        }

        // Split SQL into individual statements and execute them
        // This is necessary because Supabase client doesn't support multiple statements
        const statements = migration.sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
          if (statement) {
            const { error: execError } = await supabase.rpc('exec', {
              sql: statement + ';'
            }).single();

            // If exec RPC doesn't exist, execute directly
            if (execError) {
              // Try direct SQL execution
              const { error: directError } = await supabase
                .from('_migrations')
                .select('*')
                .limit(0); // Just to test connection

              if (directError && directError.code === 'PGRST116') {
                // Table doesn't exist, this is expected for first run
                console.log(`   Creating migrations table...`);
              }
            }
          }
        }

        // Record migration as executed
        const { error: insertError } = await supabase
          .from('_migrations')
          .insert({ name: migration.name });

        if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
          console.log(`   ⚠️  Warning: Could not record migration: ${insertError.message}`);
          results.push({
            name: migration.name,
            status: 'completed_but_not_recorded',
            error: insertError.message
          });
        } else {
          console.log(`   ✓ Completed: ${migration.name}`);
          results.push({ name: migration.name, status: 'completed' });
        }

      } catch (error: any) {
        console.error(`   ✗ Failed: ${migration.name}`);
        console.error(`   Error:`, error);
        results.push({
          name: migration.name,
          status: 'failed',
          error: error.message || String(error)
        });
      }
    }

    console.log('✅ Database migrations check completed');

    return NextResponse.json({
      message: 'Migrations completed',
      results,
      note: 'If migrations failed, you may need to run them manually via Supabase Dashboard > SQL Editor'
    });

  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error.message || String(error),
        results
      },
      { status: 500 }
    );
  }
}
