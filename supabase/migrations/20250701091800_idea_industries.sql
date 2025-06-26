/*
  # Create idea_industries table

  1. New Table
    - `idea_industries`: Links ideas to multiple industries (many-to-many).
*/

CREATE TABLE IF NOT EXISTS idea_industries (
  idea_id uuid PRIMARY KEY,
  industry_id int PRIMARY KEY
); 