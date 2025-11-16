-- ============================================================================
-- Enable RLS for Migrations Table
-- Protect the internal migrations tracking table from public API access
-- ============================================================================

-- Enable Row Level Security on the migrations table
ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;

-- No policies are created intentionally:
-- - This is an internal/service table
-- - Should not be accessible via public API
-- - Only service_role (backend) should interact with it
-- - RLS with no policies = complete public access denial
