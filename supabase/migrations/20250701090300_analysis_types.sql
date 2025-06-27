/*
  # Create analysis_types table

  1. New Table
    - `analysis_types`: Defines and categorizes the different kinds of AI-generated analyses.
*/

CREATE TABLE IF NOT EXISTS analysis_types (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(100) UNIQUE NOT NULL,
  description text,
  slug varchar(100) UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 