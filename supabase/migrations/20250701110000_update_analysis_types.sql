/*
  # Reset and seed analysis_types table with new generic types and frontend component mapping
*/

-- 1. Empty the analysis_types table
TRUNCATE TABLE analysis_types RESTART IDENTITY CASCADE;

-- 2. Add frontend_component column if not exists
ALTER TABLE analysis_types ADD COLUMN IF NOT EXISTS frontend_component varchar(100);

-- 3. Insert new generic analysis types
INSERT INTO analysis_types (id, name, description, slug, frontend_component, created_at, updated_at) VALUES
  (3,  'MVP Core Features', 'Identifies the minimum set of features needed to validate the business idea with real users.', 'mvp-core-features', 'MVPFeaturesCard', now(), now()),
  (4,  'Next Steps & Action Items', 'Converts the business idea into an actionable plan with specific, prioritized tasks.', 'next-steps', 'ActionItemsCard', now(), now()),
  (5,  'Competitive Analysis', 'Identifies and assesses competitors, their strengths, weaknesses, and market positioning.', 'competitive-analysis', 'CompetitiveAnalysisCard', now(), now()),
  (6,  'Monetization Strategy', 'Develops detailed business models, pricing strategies, and revenue streams.', 'monetization-strategy', 'MonetizationStrategyCard', now(), now()),
  (7,  'Technical Stack & Workflow', 'Recommends technologies, components, and implementation workflow for building the solution.', 'technical-stack', 'TechStackCard', now(), now()),
  (8,  'Success Metrics & KPIs', 'Defines key performance indicators and metrics to track business success.', 'success-metrics', 'MetricsCard', now(), now()),
  (9,  'Risks & Mitigations', 'Identifies potential risks that could derail the business and strategies to mitigate them.', 'risks-mitigations', 'RisksCard', now(), now()),
  (10, 'Go-to-Market Plan', 'Outlines strategies for launching the product and acquiring initial users.', 'go-to-market', 'GoToMarketCard', now(), now()),
  (39, 'Opportunity Analysis', 'Evaluates the business potential of a repository.', 'opportunity-analysis', 'OpportunityAnalysisCard', now(), now()),
  (40, 'Repository Analysis', 'Technical assessment of repository quality and potential.', 'repository-evaluation', 'RepositoryEvaluationCard', now(), now());
