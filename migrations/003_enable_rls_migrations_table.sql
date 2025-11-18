-- ============================================================================
-- Enable RLS for Migrations Table
-- Protect the internal migrations tracking table from public API access
-- ============================================================================

-- Enable Row Level Security on the migrations table (idempotent)
DO $$ BEGIN
  ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Allow public read access to check database status
-- Write operations remain blocked for security
DO $$ BEGIN
  CREATE POLICY "Allow public read access to migrations table"
  ON _migrations
  FOR SELECT
  TO public
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
