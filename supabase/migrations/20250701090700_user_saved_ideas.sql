/*
  # Create user_saved_ideas table

  1. New Table
    - `user_saved_ideas`: Tracks which product ideas a user has saved for their "Ideapad" feature.
*/

CREATE TABLE IF NOT EXISTS user_saved_ideas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  idea_id uuid NOT NULL,
  saved_at timestamptz DEFAULT now(),
  notes text,
  status varchar(50) DEFAULT 'saved'
); 