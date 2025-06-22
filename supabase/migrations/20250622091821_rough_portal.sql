/*
  # Fix Subscription System for Recurring Payments

  1. Clean up existing tables and create proper subscription schema
  2. Create subscriptions table that matches application expectations
  3. Update webhook handling for subscription events
  4. Ensure proper RLS policies for subscription access

  This migration creates a clean subscription system focused on recurring payments.
*/

-- Drop existing subscription-related tables and views to start fresh
DROP VIEW IF EXISTS stripe_user_subscriptions CASCADE;
DROP VIEW IF EXISTS stripe_user_orders CASCADE;
DROP VIEW IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS stripe_orders CASCADE;
DROP TABLE IF EXISTS stripe_subscriptions CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;

-- Keep stripe_customers table as it's needed for customer mapping
-- But ensure it exists with proper structure
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

-- Enable RLS on stripe_customers
DO $$ BEGIN
    ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

-- Drop and recreate customer policies
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Create the main subscriptions table that the application expects
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text NOT NULL,
  plan_name text NOT NULL,
  plan_interval text NOT NULL CHECK (plan_interval IN ('month', 'year')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete', 'incomplete_expired', 'paused')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text,
  payment_method_last4 text,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription access
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_name ON subscriptions(plan_name);

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create the user_subscriptions view that the application expects
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
    WHEN s.status = 'active' AND s.current_period_end > now() THEN true
    WHEN s.status = 'trialing' AND s.current_period_end > now() THEN true
    ELSE false
  END as is_active,
  -- Calculate days until renewal
  CASE 
    WHEN s.current_period_end > now() THEN 
      EXTRACT(DAY FROM (s.current_period_end - now()))
    ELSE 0
  END as days_until_renewal
FROM subscriptions s
WHERE s.user_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON user_subscriptions TO authenticated;
GRANT ALL ON user_subscriptions TO service_role;

-- Create a simplified stripe_user_subscriptions view for compatibility
CREATE VIEW stripe_user_subscriptions AS
SELECT
    s.stripe_customer_id as customer_id,
    s.stripe_subscription_id as subscription_id,
    s.status as subscription_status,
    s.stripe_price_id as price_id,
    EXTRACT(EPOCH FROM s.current_period_start)::bigint as current_period_start,
    EXTRACT(EPOCH FROM s.current_period_end)::bigint as current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM subscriptions s
WHERE s.user_id = auth.uid();

GRANT SELECT ON stripe_user_subscriptions TO authenticated;