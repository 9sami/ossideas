/*
  # Create get_repositories function for filtering repositories by analysis results

  1. New Function
    - `get_repositories()` - Filters repositories based on presence/absence of analysis results
    - Supports filtering by analysis type IDs with flexible logic
    - Includes optional limit parameter for result count control

  2. Function Parameters
    - `has` (int[]): Analysis type IDs that repositories MUST have
    - `has_not` (int[]): Analysis type IDs that repositories MUST NOT have
    - `limit_count` (integer): Optional limit on number of results returned

  3. Logic Cases
    - Case 1: Neither has nor has_not - Returns repositories with NO analysis results
    - Case 2: Both has and has_not - Returns repositories that have specified types but not others
    - Case 3: Only has_not - Returns repositories that don't have specified analysis types
    - Case 4: Only has - Returns repositories that have specified analysis types

  4. Performance
    - Uses dynamic SQL for optimal query execution
    - Filters out skipped repositories by default
    - Leverages existing indexes on analysis_results table
*/

CREATE OR REPLACE FUNCTION get_repositories(
  has int[] DEFAULT NULL,
  has_not int[] DEFAULT NULL,
  limit_count integer DEFAULT NULL
)
RETURNS SETOF repositories
LANGUAGE plpgsql
AS $$
DECLARE
  sql text;
BEGIN
  -- Start with base query - only include non-skipped repositories
  sql := 'SELECT * FROM repositories r WHERE is_skipped = false';

  -- Case 1: neither has nor has_not - return repositories with no analysis results
  IF (has IS NULL OR array_length(has, 1) = 0) AND (has_not IS NULL OR array_length(has_not, 1) = 0) THEN
    sql := sql || ' AND id NOT IN (
      SELECT repository_id FROM analysis_results
      WHERE repository_id IS NOT NULL
    )';

  -- Case 2: both has and has_not provided - repositories that have some but not others
  ELSIF array_length(has, 1) > 0 AND array_length(has_not, 1) > 0 THEN
    sql := sql || ' AND id IN (
      SELECT repository_id FROM analysis_results
      WHERE analysis_type_id = ANY($1)
    ) AND id NOT IN (
      SELECT repository_id FROM analysis_results
      WHERE analysis_type_id = ANY($2)
    )';

  -- Case 3: only has_not - repositories that don't have specified analysis types
  ELSIF (has IS NULL OR array_length(has, 1) = 0) AND array_length(has_not, 1) > 0 THEN
    sql := sql || ' AND id NOT IN (
      SELECT repository_id FROM analysis_results
      WHERE analysis_type_id = ANY($2)
    )';

  -- Case 4: only has - repositories that have specified analysis types
  ELSIF array_length(has, 1) > 0 AND (has_not IS NULL OR array_length(has_not, 1) = 0) THEN
    sql := sql || ' AND id IN (
      SELECT repository_id FROM analysis_results
      WHERE analysis_type_id = ANY($1)
    )';
  END IF;

  -- Add optional LIMIT clause
  IF limit_count IS NOT NULL THEN
    sql := sql || ' LIMIT ' || limit_count;
  END IF;

  -- Execute the dynamic query and return results
  RETURN QUERY EXECUTE sql USING has, has_not;
END;
$$;

-- Add function comment for documentation
COMMENT ON FUNCTION get_repositories(int[], int[], integer) IS 'Filters repositories based on presence or absence of specific analysis results. Supports flexible filtering logic with optional result limiting.';