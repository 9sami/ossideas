/*
  # Create user_liked_ideas table

  1. New Table
    - `user_liked_ideas`: Tracks which product ideas a user has liked.
*/

CREATE TABLE IF NOT EXISTS user_liked_ideas (
  user_id uuid PRIMARY KEY,
  idea_id uuid PRIMARY KEY,
  liked_at timestamptz DEFAULT now()
); 