/*
  # Create categories table

  1. New Table
    - `categories`: Stores predefined categories to classify open-source repositories.
*/

CREATE TABLE IF NOT EXISTS categories (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) UNIQUE NOT NULL,
  description text,
  slug varchar(255) UNIQUE NOT NULL,
  total_repositories int DEFAULT 0,
  avg_business_score decimal(5,2),
  market_size text,
  growth_rate decimal(5,2),
  top_repository_id uuid,
  total_stars_in_category bigint DEFAULT 0,
  category_insights jsonb
); 