/*
  # Create ideas table

  1. New Table
    - `ideas`: Represents a monetizable product opportunity derived from an open-source repository.
*/

CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id uuid NOT NULL,
  title varchar(511) NOT NULL,
  summary text,
  overall_teardown_score decimal(5,2),
  likes_count int DEFAULT 0,
  is_premium boolean DEFAULT true,
  status varchar(50) DEFAULT 'pending_generation',
  generated_at timestamptz DEFAULT now(),
  last_updated_at timestamptz DEFAULT now(),
  generated_by_ai_model varchar(100)
); 