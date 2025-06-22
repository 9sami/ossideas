/*
  # Cleanup Subscription Schema

  This migration cleans up the subscription system to focus only on recurring subscriptions:
  
  1. Remove one-time product references
  2. Simplify subscription table structure
  3. Add proper indexes and constraints
  4. Create a clean subscription management system
*/

-- Drop the one-time orders table since we're focusing only on subscriptions
DROP TABLE IF EXISTS stripe_orders;

-- Clean up and simplify the stripe_subscriptions table
DROP TABLE IF EXISTS stripe_subscriptions;

-- Create a new, cleaner subscription table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text NOT NULL,
  plan_name text NOT NULL,
  plan_interval text NOT NULL CHECK (plan_interval IN ('month', 'year')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
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

-- Enable Row Level Security
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

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy subscription access
CREATE OR REPLACE VIEW user_subscriptions AS
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
FROM subscriptions s;

-- Grant access to the view
GRANT SELECT ON user_subscriptions TO authenticated;
GRANT ALL ON user_subscriptions TO service_role; 