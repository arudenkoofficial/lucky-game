#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Check migration status
 * This script checks if migrations are needed and provides instructions
 */

console.log('\n🔍 Checking database migration status...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local file not found!');
  console.log('\n📋 Setup instructions:');
  console.log('   1. Copy .env.example to .env.local');
  console.log('   2. Add your Supabase credentials from:');
  console.log('      https://supabase.com/dashboard/project/_/settings/api\n');
  console.log('   Required variables:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY (for auto-migrations)\n');
  process.exit(1);
}

// Read environment variables
require('dotenv').config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('⚠️  Missing Supabase environment variables!');
  console.log('\nPlease set the following in .env.local:');
  if (!supabaseUrl) console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseKey) console.log('   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  console.log('\nYou can find these in your Supabase Dashboard:');
  console.log('https://supabase.com/dashboard/project/_/settings/api\n');
  process.exit(1);
}

console.log('✅ Supabase configuration found');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);

// Check migrations directory
const migrationsDir = path.join(__dirname, '..', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  console.log('\n❌ Migrations directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort();

console.log(`\n📂 Found ${files.length} migration file(s):`);
files.forEach((file, index) => {
  console.log(`   ${index + 1}. ${file}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n🚀 To initialize your database, choose one option:\n');

console.log('Option 1: Manual setup (Recommended for first-time setup)');
console.log('   Run: npm run db:init');
console.log('   This will show you the SQL to run in Supabase Dashboard\n');

if (serviceKey) {
  console.log('Option 2: Auto-migration via API');
  console.log('   1. Start your dev server: npm run dev');
  console.log('   2. Visit: http://localhost:3000/api/migrate');
  console.log('   Note: Only works in development mode\n');
} else {
  console.log('Option 2: Auto-migration via API (not available)');
  console.log('   To enable, add SUPABASE_SERVICE_ROLE_KEY to .env.local');
  console.log('   Find it at: https://supabase.com/dashboard/project/_/settings/api\n');
}

console.log('Option 3: Manual SQL execution');
console.log('   1. Go to: https://supabase.com/dashboard/project/_/sql/new');
console.log('   2. Copy SQL from files in the migrations/ folder');
console.log('   3. Paste and run in the SQL Editor\n');

console.log('='.repeat(60) + '\n');
