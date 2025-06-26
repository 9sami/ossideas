/*
  # Create repositories table

  1. New Table
    - `repositories`: Stores comprehensive data extracted from open-source repositories.
*/

CREATE TABLE IF NOT EXISTS repositories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_repo_id bigint UNIQUE NOT NULL,
  owner varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  full_name varchar(511) UNIQUE NOT NULL,
  description text,
  html_url varchar(1023) UNIQUE NOT NULL,
  stargazers_count int DEFAULT 0,
  forks_count int DEFAULT 0,
  watchers_count int DEFAULT 0,
  open_issues_count int DEFAULT 0,
  license_key varchar(100),
  license_name varchar(255),
  last_commit_at timestamptz,
  created_at_github timestamptz,
  updated_at_github timestamptz,
  is_archived boolean DEFAULT false,
  topics text[],
  readme_content text,
  scanned_at timestamptz DEFAULT now(),
  data_quality_score decimal(5,2),
  is_ai_agent_project boolean DEFAULT false,
  additional_metadata jsonb,
  document_vectors tsvector
); 