/*
  # Create repository_categories table

  1. New Table
    - `repository_categories`: Junction table for many-to-many relationship between repositories and categories.
*/

CREATE TABLE IF NOT EXISTS repository_categories (
  repository_id uuid PRIMARY KEY,
  category_id int PRIMARY KEY
); 