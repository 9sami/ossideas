/*
  # Create industries table

  1. New Table
    - `industries`: Defines industries for user profiling and industry-specific analytics.
*/

CREATE TABLE IF NOT EXISTS industries (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) UNIQUE NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  total_ideas_generated int DEFAULT 0,
  avg_idea_score decimal(5,2),
  market_potential text,
  industry_growth_rate decimal(5,2),
  top_idea_id uuid,
  industry_insights jsonb
); 