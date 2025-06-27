/*
  # Create languages table

  1. New Table
    - `languages`: Stores a list of programming languages for categorizing repositories and user preferences.
*/

CREATE TABLE IF NOT EXISTS languages (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(100) UNIQUE NOT NULL,
  slug varchar(100) UNIQUE NOT NULL
); 