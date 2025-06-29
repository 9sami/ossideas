/*
  # Add foreign key constraint for analysis_results.idea_id

  1. Changes Made
    - Add foreign key constraint linking analysis_results.idea_id to ideas.id
    - This ensures referential integrity between analysis results and ideas
    - Uses CASCADE delete to clean up analysis results when ideas are deleted

  2. Security
    - Maintains data consistency between analysis_results and ideas tables
    - Prevents orphaned analysis results when ideas are removed
*/

-- Add foreign key constraint for idea_id referencing ideas table
ALTER TABLE analysis_results
  ADD CONSTRAINT fk_analysis_results_idea_id FOREIGN KEY (idea_id)
    REFERENCES ideas(id) ON DELETE CASCADE;

-- Add comment for documentation
COMMENT ON CONSTRAINT fk_analysis_results_idea_id ON analysis_results IS 'Links analysis results to their corresponding ideas with cascade delete';