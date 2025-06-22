/*
  # Undo Recent Subscription Changes

  1. Changes Made
    - Remove real-time features and triggers
    - Drop additional indexes that were added
    - Remove unique constraint for active subscriptions
    - Restore original user_subscriptions view
    - Keep essential RLS policies and core indexes

  2. Security
    - Maintain existing RLS policies
    - Keep core functionality intact
*/

-- Drop the subscription changes trigger
DROP TRIGGER IF EXISTS subscription_changes_trigger ON subscriptions;

-- Drop the notification function
DROP FUNCTION IF EXISTS notify_subscription_changes();

-- Remove from real-time publication (handle gracefully)
DO $$ 
BEGIN
    -- Try to remove table from publication, ignore if it doesn't exist
    BEGIN
        ALTER PUBLICATION supabase_realtime DROP TABLE subscriptions;
    EXCEPTION
        WHEN undefined_object THEN
            -- Publication or table not in publication, ignore
            NULL;
        WHEN undefined_table THEN
            -- Table doesn't exist in publication, ignore
            NULL;
    END;
END $$;

-- Drop the additional indexes that were added
DROP INDEX IF EXISTS idx_subscriptions_user_status_active;
DROP INDEX IF EXISTS idx_subscriptions_stripe_id_lookup;
DROP INDEX IF EXISTS idx_subscriptions_status_user_id;
DROP INDEX IF EXISTS idx_subscriptions_updated_at;

-- Drop the unique constraint for active subscriptions
DROP INDEX IF EXISTS idx_subscriptions_user_active_unique;

-- Restore the original user_subscriptions view
DROP VIEW IF EXISTS user_subscriptions;

CREATE VIEW user_subscriptions AS
SELECT 
  s.id,
  s.user_id,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.stripe_price_id,
  s.plan_name,
  s.plan_interval,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.payment_method_brand,
  s.payment_method_last4,
  s.amount_cents,
  s.currency,
  s.created_at,
  s.updated_at,
  -- Calculate if subscription is active
  CASE 
    WHEN s.status = 'active' AND (s.current_period_end IS NULL OR s.current_period_end > now()) THEN true
    WHEN s.status = 'trialing' AND (s.current_period_end IS NULL OR s.current_period_end > now()) THEN true
    ELSE false
  END as is_active,
  -- Calculate days until renewal
  CASE 
    WHEN s.current_period_end IS NOT NULL AND s.current_period_end > now() THEN 
      EXTRACT(DAY FROM (s.current_period_end - now()))
    ELSE 0
  END as days_until_renewal
FROM subscriptions s
WHERE s.user_id = auth.uid()
ORDER BY s.created_at DESC;

-- Grant permissions
GRANT SELECT ON user_subscriptions TO authenticated;
GRANT ALL ON user_subscriptions TO service_role;

-- Keep the core RLS policies as they were (these are still needed)
-- Users can view their own subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own subscriptions
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all subscriptions
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure the basic indexes from the original migration are still present
-- (These are essential for performance and should remain)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_name ON subscriptions(plan_name);

-- Ensure the updated_at trigger is still present
CREATE TRIGGER IF NOT EXISTS update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();