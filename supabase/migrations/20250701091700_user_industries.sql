/*
  # Create user_industries table

  1. New Table
    - `user_industries`: Links users to multiple industries (many-to-many).
*/

CREATE TABLE IF NOT EXISTS user_industries (
  user_id uuid PRIMARY KEY,
  industry_id int PRIMARY KEY
); 