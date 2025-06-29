/*
  # Seed Analysis Types

  1. New Analysis Types
    - `Opportunity Analysis` - Comprehensive business opportunity assessment
    - `Market Analysis` - Market size, trends, and validation analysis  
    - `Technical Analysis` - Technical feasibility and implementation assessment
    - `Competitive Analysis` - Competitor landscape and positioning analysis
    - `Monetization Strategy` - Revenue models and pricing strategies
    - `Risk Analysis` - Potential risks and mitigation strategies

  2. Security
    - No RLS needed as analysis_types is a reference table
    - Public read access for authenticated users

  3. Data Structure
    - Each analysis type has a unique slug for programmatic access
    - Descriptive names and detailed descriptions for UI display
*/

-- Insert core analysis types that will be used across the platform
INSERT INTO analysis_types (name, description, slug) VALUES 
(
  'Opportunity Analysis',
  'Comprehensive analysis of business opportunity potential for open source repositories, including market validation, strategic scores, and product vision assessment.',
  'opportunity-analysis'
),
(
  'Market Analysis', 
  'In-depth market research including target audience identification, market size estimation, competitive landscape mapping, and demand validation.',
  'market-analysis'
),
(
  'Technical Analysis',
  'Technical feasibility assessment covering architecture review, scalability considerations, technology stack evaluation, and implementation complexity.',
  'technical-analysis'
),
(
  'Competitive Analysis',
  'Comprehensive competitor research including direct and indirect competitors, feature comparison, market positioning, and competitive advantages.',
  'competitive-analysis'
),
(
  'Monetization Strategy',
  'Revenue model development including pricing strategies, subscription models, freemium approaches, and enterprise licensing opportunities.',
  'monetization-strategy'
),
(
  'Risk Analysis',
  'Risk assessment covering technical risks, market risks, competitive threats, regulatory considerations, and mitigation strategies.',
  'risk-analysis'
),
(
  'SWOT Analysis',
  'Strengths, Weaknesses, Opportunities, and Threats analysis providing strategic insights for business development and positioning.',
  'swot-analysis'
),
(
  'Target Market Analysis',
  'Detailed target market segmentation, customer persona development, and go-to-market strategy recommendations.',
  'target-market-analysis'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = now();

-- Add comment to document the seeding
COMMENT ON TABLE analysis_types IS 'Reference table for different types of AI-generated analyses. Seeded with core analysis types used across the platform.';