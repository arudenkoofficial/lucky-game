-- ============================================================================
-- Allow Read Access to Migrations Table
-- Fix: "Could not find the table 'public._migrations' in the schema cache"
-- ============================================================================

-- Create a policy to allow anyone to read from _migrations table
-- This enables database status checks from the frontend
-- Write operations remain blocked for security
CREATE POLICY "Allow public read access to migrations table"
ON _migrations
FOR SELECT
TO public
USING (true);
