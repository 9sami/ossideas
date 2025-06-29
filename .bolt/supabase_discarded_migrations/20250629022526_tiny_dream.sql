/*
  # Create errors table for logging system errors

  1. New Table
    - `errors`: Stores error messages and details from various system components
      - `id` (uuid, primary key) - Unique identifier for each error
      - `error_message` (text) - Concise error message
      - `notes` (text, nullable) - Additional context or human-readable notes
      - `error_payload` (jsonb, nullable) - Full error data in flexible JSON format
      - `source` (text, nullable) - Source of the error (e.g., 'n8n', 'frontend', 'webhook')
      - `severity` (text) - Error severity level (info, warning, error, critical)
      - `created_at` (timestamptz) - When the error occurred
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `errors` table
    - Add policy for service role to manage all error records
    - Add policy for authenticated users to view their own errors (if user_id is added later)

  3. Indexes
    - Add index on source for filtering by error source
    - Add index on severity for filtering by error level
    - Add index on created_at for time-based queries

  4. Triggers
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create errors table
CREATE TABLE IF NOT EXISTS errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  notes text,
  error_payload jsonb,
  source text,
  severity text DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE errors ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to manage all errors
CREATE POLICY "Service role can manage all errors"
  ON errors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated users to view errors (for future use)
CREATE POLICY "Authenticated users can view errors"
  ON errors
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_errors_source ON errors(source);
CREATE INDEX IF NOT EXISTS idx_errors_severity ON errors(severity);
CREATE INDEX IF NOT EXISTS idx_errors_created_at ON errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_errors_source_severity ON errors(source, severity);

-- Create trigger for updated_at (using existing function)
CREATE TRIGGER update_errors_updated_at
  BEFORE UPDATE ON errors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to document the table purpose
COMMENT ON TABLE errors IS 'Stores error messages and details from various system components like n8n, webhooks, and other processes';
COMMENT ON COLUMN errors.error_payload IS 'Flexible JSON field for storing complete error details, stack traces, or webhook payloads';
COMMENT ON COLUMN errors.source IS 'Identifies the source system that generated the error (e.g., n8n, stripe-webhook, frontend)';
COMMENT ON COLUMN errors.severity IS 'Error severity level: info (informational), warning (potential issue), error (actual error), critical (system failure)';