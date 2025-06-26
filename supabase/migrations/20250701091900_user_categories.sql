/*
  # Create user_categories table

  1. New Table
    - `user_categories`: Links users to multiple categories (many-to-many).
*/

CREATE TABLE IF NOT EXISTS user_categories (
  user_id uuid PRIMARY KEY,
  category_id int PRIMARY KEY
); 