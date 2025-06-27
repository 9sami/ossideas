/*
  # Add languages (json) column to repositories table
*/

ALTER TABLE repositories ADD COLUMN IF NOT EXISTS languages json; 