/*
  # Clean Database and Fix Schema Issues

  1. Clean Up
    - Drop all existing subscription and customer data
    - Remove any conflicting constraints or policies
    - Start fresh with proper schema

  2. Recreate Tables
    - stripe_customers table with proper structure
    - subscriptions table with correct relationships
    - user_subscriptions view for application queries

  3. Security
    - Proper RLS policies for all operations
    - Service role permissions for webhook processing
    - User permissions for reading their own data

  4. Indexes
    - Performance indexes for common queries
    - Unique constraints where needed
*/

-- Clean up existing data and constraints
DROP VIEW IF EXISTS user_subscriptions CASCADE;
DROP VIEW IF EXISTS stripe_user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS stripe_customers CASCADE;

-- Create stripe_customers table
CREATE TABLE stripe_customers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

-- Create unique indexes
CREATE UNIQUE INDEX idx_stripe_customers_user_id_active 
  ON stripe_customers(user_id) 
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX idx_stripe_customers_customer_id_active 
  ON stripe_customers(customer_id) 
  WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Create policies for stripe_customers
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Service role can manage all customer data"
  ON stripe_customers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create subscriptions table
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

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
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
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan_name ON subscriptions(plan_name);

-- Create trigger for updated_at on subscriptions
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create the user_subscriptions view
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

-- Grant permissions on the view
GRANT SELECT ON user_subscriptions TO authenticated;
GRANT ALL ON user_subscriptions TO service_role;

-- Create stripe_user_subscriptions view for compatibility
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

-- Grant permissions
GRANT SELECT ON stripe_user_subscriptions TO authenticated;
GRANT ALL ON stripe_user_subscriptions TO service_role;

-- Grant table permissions
GRANT ALL ON stripe_customers TO service_role;
GRANT ALL ON subscriptions TO service_role;
GRANT SELECT ON stripe_customers TO authenticated;
GRANT SELECT ON subscriptions TO authenticated;