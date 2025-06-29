/*
  # Create errors table for logging system errors

  1. New Table
    - `errors`
      - `id` (uuid, primary key)
      - `error` (text, not null) - Main error message
      - `note` (text, nullable) - Additional notes or context
      - `error_payload` (jsonb, nullable) - Flexible JSON field for error details
      - `source` (text, nullable) - Source of the error (e.g., 'n8n', 'webhook', 'api')
      - `severity` (text, nullable) - Error severity level
      - `created_at` (timestamptz, default now())

  2. Security
    - No RLS policies for now (open access as requested)
    - Can be restricted later when needed

  3. Indexes
    - Index on created_at for time-based queries
    - Index on source for filtering by error source
    - Index on severity for filtering by error level
*/

-- Create errors table
CREATE TABLE IF NOT EXISTS errors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  error text NOT NULL,
  note text,
  error_payload jsonb,
  source text,
  severity text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_errors_created_at ON errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_errors_source ON errors(source);
CREATE INDEX IF NOT EXISTS idx_errors_severity ON errors(severity);
CREATE INDEX IF NOT EXISTS idx_errors_source_created_at ON errors(source, created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE errors IS 'Stores error messages and details from various system components like n8n workflows';
COMMENT ON COLUMN errors.error IS 'Main error message or description';
COMMENT ON COLUMN errors.note IS 'Additional context, notes, or debugging information';
COMMENT ON COLUMN errors.error_payload IS 'Flexible JSON field for storing detailed error data, stack traces, or related information';
COMMENT ON COLUMN errors.source IS 'Source system that generated the error (e.g., n8n, webhook, api, cron)';
COMMENT ON COLUMN errors.severity IS 'Error severity level (e.g., low, medium, high, critical)';