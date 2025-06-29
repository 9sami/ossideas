/*
  # Add skip tracking fields to repositories table

  1. New Columns
    - `is_skipped` (boolean) - Flag indicating if the repository was skipped during processing
    - `skip_note` (text) - Optional note explaining why the repository was skipped

  2. Changes
    - Add is_skipped column with default false and not null constraint
    - Add skip_note column as nullable text field
    - Add comments for documentation

  3. Purpose
    - Track repositories that are intentionally skipped during processing
    - Store reasons for skipping to help with debugging and analysis
    - Allow filtering and reporting on skipped vs processed repositories
*/

-- Add is_skipped column with default false
ALTER TABLE repositories 
  ADD COLUMN IF NOT EXISTS is_skipped boolean NOT NULL DEFAULT false;

-- Add skip_note column as nullable text
ALTER TABLE repositories 
  ADD COLUMN IF NOT EXISTS skip_note text;

-- Add comments for documentation
COMMENT ON COLUMN repositories.is_skipped IS 'Flag indicating if the repository was skipped during processing';
COMMENT ON COLUMN repositories.skip_note IS 'Optional note explaining why the repository was skipped (e.g., insufficient data, processing errors, manual exclusion)';

-- Create index for filtering skipped repositories
CREATE INDEX IF NOT EXISTS idx_repositories_is_skipped ON repositories(is_skipped);

-- Create composite index for skipped repositories with creation date for reporting
CREATE INDEX IF NOT EXISTS idx_repositories_skipped_created ON repositories(is_skipped, created_at_github) WHERE is_skipped = true;