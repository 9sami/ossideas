/*
  # Create submitted_repositories table

  1. New Table
    - `submitted_repositories`: Tracks repositories submitted by users for idea generation.
*/

CREATE TABLE IF NOT EXISTS submitted_repositories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  github_url varchar(1023) NOT NULL,
  status varchar(50) DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  notes text
); 