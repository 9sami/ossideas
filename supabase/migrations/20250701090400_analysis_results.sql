/*
  # Create analysis_results table

  1. New Table
    - `analysis_results`: Stores individual AI-generated analysis components for product ideas.
*/

CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id uuid NOT NULL,
  analysis_type_id int NOT NULL,
  title varchar(511) NOT NULL,
  summary_description text,
  overall_score decimal(5,2),
  analysis_payload jsonb NOT NULL,
  generated_by_ai_model varchar(100),
  generated_at timestamptz DEFAULT now(),
  curated_by_user_id uuid,
  document_vectors tsvector
); 