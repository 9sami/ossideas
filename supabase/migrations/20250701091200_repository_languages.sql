/*
  # Create repository_languages table

  1. New Table
    - `repository_languages`: Links repositories to the programming languages they use.
*/

CREATE TABLE IF NOT EXISTS repository_languages (
  repository_id uuid PRIMARY KEY,
  language_id int PRIMARY KEY
); 