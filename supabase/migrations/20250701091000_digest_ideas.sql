/*
  # Create digest_ideas table

  1. New Table
    - `digest_ideas`: Junction table linking email_digests with product ideas.
*/

CREATE TABLE IF NOT EXISTS digest_ideas (
  digest_id uuid PRIMARY KEY,
  idea_id uuid PRIMARY KEY,
  position_in_digest int
); 