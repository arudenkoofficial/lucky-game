-- Create migrations tracking table
CREATE TABLE IF NOT EXISTS _migrations (
  id serial PRIMARY KEY,
  name varchar(255) UNIQUE NOT NULL,
  executed_at timestamptz DEFAULT now()
);
