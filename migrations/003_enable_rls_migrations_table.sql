-- ============================================================================
-- Enable RLS for Migrations Table
-- Protect the internal migrations tracking table from public API access
-- ============================================================================

-- Enable Row Level Security on the migrations table
ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to check database status
-- Write operations remain blocked for security
CREATE POLICY "Allow public read access to migrations table"
ON _migrations
FOR SELECT
TO public
USING (true);
