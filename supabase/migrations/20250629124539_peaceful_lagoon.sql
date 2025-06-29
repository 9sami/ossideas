/*
  # Create function to get ideas without MVP features analysis

  1. New Function
    - `get_ideas_without_mvp_features()` - Returns ideas that don't have MVP features analysis
    - Supports optional limit parameter for result count control

  2. Function Parameters
    - `limit_count` (integer): Optional limit on number of results returned (default: 5)

  3. Logic
    - Finds ideas that don't have an associated analysis_result with analysis_type_id = 3
    - Only returns published ideas to ensure they're ready for feature analysis
    - Orders by most recently generated first

  4. Purpose
    - Supports the MVP Features workflow to find ideas that need feature analysis
    - Enables efficient batch processing of ideas without redundant analysis
*/

CREATE OR REPLACE FUNCTION get_ideas_without_mvp_features(limit_count integer DEFAULT 5)
RETURNS SETOF ideas
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT i.*
  FROM ideas i
  WHERE i.id NOT IN (
    SELECT ar.idea_id
    FROM analysis_results ar
    WHERE ar.analysis_type_id = 3
    AND ar.idea_id IS NOT NULL
  )
  AND i.status = 'published'
  ORDER BY i.generated_at DESC
  LIMIT limit_count;
END;
$$;

-- Add function comment for documentation
COMMENT ON FUNCTION get_ideas_without_mvp_features(integer) IS 'Returns ideas that do not have MVP features analysis (analysis_type_id = 3) with optional result limiting.';