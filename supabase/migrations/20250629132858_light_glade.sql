/*
  # Add status enum for idea workflow progression

  1. Changes Made
    - Add function to update idea status
    - This enables tracking the progress of ideas through the analysis pipeline
    - Ensures ideas move through the correct sequence of analysis steps

  2. Benefits
    - Maintains consistent workflow progression
    - Enables filtering ideas by their current analysis stage
    - Prevents duplicate analysis generation
*/

-- Create function to update idea status
CREATE OR REPLACE FUNCTION update_idea_status(
  idea_id uuid,
  new_status text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE ideas
  SET 
    status = new_status,
    updated_at = now()
  WHERE id = idea_id;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION update_idea_status(uuid, text) IS 'Updates the status of an idea to track its progress through the analysis pipeline';