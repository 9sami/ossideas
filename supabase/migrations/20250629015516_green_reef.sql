/*
  # Alter analysis_results table to support repository-first analysis

  1. Changes Made
    - Make idea_id nullable (analysis can exist without an idea initially)
    - Add repository_id as NOT NULL (every analysis must be tied to a repository)
    - Drop existing foreign key constraint on idea_id
    - Add foreign key constraint for repository_id

  2. Rationale
    - Analysis can be generated directly from repositories before ideas are created
    - Every analysis must be traceable to a source repository
    - Ideas can be created later and linked to existing analysis results
*/

-- Step 1: Drop existing foreign key constraint on idea_id
ALTER TABLE analysis_results
  DROP CONSTRAINT IF EXISTS fk_analysis_results_idea_id;

-- Step 2: Alter idea_id column to be nullable
ALTER TABLE analysis_results
  ALTER COLUMN idea_id DROP NOT NULL;

-- Step 3: Add repository_id column as NOT NULL
ALTER TABLE analysis_results
  ADD COLUMN repository_id uuid NOT NULL;

-- Step 4: Add foreign key constraint for repository_id
ALTER TABLE analysis_results
  ADD CONSTRAINT fk_analysis_results_repository_id FOREIGN KEY (repository_id)
    REFERENCES repositories(id) ON DELETE CASCADE;

-- Step 5: Add index for performance on repository_id lookups
CREATE INDEX IF NOT EXISTS idx_analysis_results_repository_id ON analysis_results(repository_id);

-- Step 6: Add composite index for repository + analysis type queries
CREATE INDEX IF NOT EXISTS idx_analysis_results_repository_type ON analysis_results(repository_id, analysis_type_id);