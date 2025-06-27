/*
  # Create user_preferred_languages table

  1. New Table
    - `user_preferred_languages`: Stores programming languages preferred by users.
*/

CREATE TABLE IF NOT EXISTS user_preferred_languages (
  user_id uuid PRIMARY KEY,
  language_id int PRIMARY KEY
); 