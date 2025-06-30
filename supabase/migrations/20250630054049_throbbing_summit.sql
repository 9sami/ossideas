-- Create function to get ideas without risk analysis
CREATE OR REPLACE FUNCTION get_ideas_without_risks(limit_count integer DEFAULT 5)
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
    WHERE ar.analysis_type_id = 9
    AND ar.idea_id IS NOT NULL
  )
  AND i.status = 'pending_risks'
  ORDER BY i.generated_at DESC
  LIMIT limit_count;
END;
$$;

-- Add function comment for documentation
COMMENT ON FUNCTION get_ideas_without_risks(integer) IS 'Returns ideas that do not have risk analysis (analysis_type_id = 9) with optional result limiting.';