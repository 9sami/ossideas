/*
  # Create users table

  1. New Table
    - `users`: Stores user authentication and profile information.
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar(255) UNIQUE NOT NULL,
  name varchar(255),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_premium boolean DEFAULT false,
  stripe_customer_id varchar(255) UNIQUE,
  github_id varchar(255) UNIQUE,
  linkedin_id varchar(255) UNIQUE,
  last_login_at timestamptz,
  preferences jsonb,
  position varchar(255),
  interests text[]
); 