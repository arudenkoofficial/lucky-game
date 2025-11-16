#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Database initialization script
 * This script helps you set up the database by providing SQL commands
 * that you can run in the Supabase SQL Editor
 */

console.log('🎲 Lucky Game - Database Initialization\n');
console.log('=' .repeat(60));

const migrationsDir = path.join(__dirname, '..', 'migrations');

// Check if migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  console.log('❌ Migrations directory not found!');
  console.log('   Expected location:', migrationsDir);
  process.exit(1);
}

// Read all SQL files
const files = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort();

if (files.length === 0) {
  console.log('❌ No migration files found!');
  process.exit(1);
}

console.log(`\n📂 Found ${files.length} migration file(s):\n`);

files.forEach((file, index) => {
  console.log(`   ${index + 1}. ${file}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n📋 INSTRUCTIONS:\n');
console.log('1. Open your Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/_/sql/new\n');
console.log('2. Copy and paste the SQL below into the SQL Editor\n');
console.log('3. Click "RUN" to execute the migration\n');
console.log('4. Repeat for each migration file in order\n');
console.log('='.repeat(60));

// Print each migration
files.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log(`\n\n${'='.repeat(60)}`);
  console.log(`📄 Migration ${index + 1}/${files.length}: ${file}`);
  console.log('='.repeat(60));
  console.log('\n-- Copy everything below this line --\n');
  console.log(content);
  console.log('\n-- End of migration --\n');
});

console.log('\n' + '='.repeat(60));
console.log('\n✅ After running all migrations, your database will have:\n');
console.log('   • notes table (example data)');
console.log('   • games table (for game records)');
console.log('   • user_profiles table (user data and balance)');
console.log('   • Automatic user profile creation on signup');
console.log('   • Row Level Security (RLS) policies');
console.log('\n' + '='.repeat(60));
console.log('\n💡 TIP: You can also use the auto-migration endpoint:\n');
console.log('   After setting up SUPABASE_SERVICE_ROLE_KEY in .env.local,');
console.log('   visit: http://localhost:3000/api/migrate\n');
console.log('='.repeat(60) + '\n');
