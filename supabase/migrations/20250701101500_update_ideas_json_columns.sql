/*
  # Add or update JSON columns in ideas table
  - All columns are json type and use small snake_case
*/

ALTER TABLE ideas
  ADD COLUMN IF NOT EXISTS overview json,
  ADD COLUMN IF NOT EXISTS categories json,
  ADD COLUMN IF NOT EXISTS industries json,
  ADD COLUMN IF NOT EXISTS target_market json,
  ADD COLUMN IF NOT EXISTS direct_competitors json,
  ADD COLUMN IF NOT EXISTS indirect_competitors json,
  ADD COLUMN IF NOT EXISTS swot_analysis json,
  ADD COLUMN IF NOT EXISTS core_features json,
  ADD COLUMN IF NOT EXISTS milestones json,
  ADD COLUMN IF NOT EXISTS budget_consideration json,
  ADD COLUMN IF NOT EXISTS pre_launch json,
  ADD COLUMN IF NOT EXISTS post_launch json;

-- Update existing columns to json type if needed
DO $$
DECLARE
  col RECORD;
  col_defs CONSTANT jsonb := '[
    "overview",
    "categories",
    "industries",
    "target_market",
    "direct_competitors",
    "indirect_competitors",
    "swot_analysis",
    "core_features",
    "milestones",
    "budget_consideration",
    "pre_launch",
    "post_launch"
  ]'::jsonb;
BEGIN
  FOR col IN SELECT * FROM jsonb_array_elements_text(col_defs) LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'ideas' AND column_name = col.value AND data_type <> 'json'
    ) THEN
      EXECUTE format('ALTER TABLE ideas ALTER COLUMN %I TYPE json USING %I::json', col.value, col.value);
    END IF;
  END LOOP;
END $$; 