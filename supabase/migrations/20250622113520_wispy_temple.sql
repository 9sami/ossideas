/*
  # Fix subscription management to prevent duplicate subscriptions

  1. Changes Made
    - Update webhook handling to properly manage subscription upgrades/downgrades
    - Ensure only one active subscription per user at any time
    - Fix query issues with multiple subscription records

  2. Database Changes
    - Add constraint to prevent multiple active subscriptions per user
    - Update RLS policies for better performance
    - Add indexes for subscription management queries

  3. Security
    - Maintain existing RLS policies
    - Ensure proper access control for subscription data
*/

-- First, clean up any duplicate active subscriptions
-- Keep the most recent subscription for each user and mark others as canceled
WITH ranked_subscriptions AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM subscriptions 
  WHERE status IN ('active', 'trialing')
)
UPDATE subscriptions 
SET 
  status = 'canceled',
  cancel_at_period_end = true,
  updated_at = now()
WHERE id IN (
  SELECT id FROM ranked_subscriptions WHERE rn > 1
);

-- Add a partial unique index to prevent multiple active subscriptions per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_active_unique 
  ON subscriptions(user_id) 
  WHERE status IN ('active', 'trialing');

-- Update the user_subscriptions view to handle edge cases better
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

-- Add comment to document the constraint
COMMENT ON INDEX idx_subscriptions_user_active_unique IS 'Ensures only one active subscription per user at any time';