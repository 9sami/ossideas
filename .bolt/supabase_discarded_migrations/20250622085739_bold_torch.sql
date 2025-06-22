/*
  # Create subscriptions table for Stripe subscription management

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles.id)
      - `stripe_customer_id` (text)
      - `stripe_subscription_id` (text, unique)
      - `stripe_price_id` (text)
      - `plan_name` (text)
      - `plan_interval` (text) - 'month' or 'year'
      - `status` (text) - subscription status
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `cancel_at_period_end` (boolean, default false)
      - `payment_method_brand` (text, nullable)
      - `payment_method_last4` (text, nullable)
      - `amount_cents` (integer) - amount in cents
      - `currency` (text, default 'usd')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policies for users to read their own subscriptions
    - Add policy for service role to manage subscriptions

  3. Indexes
    - Add indexes for performance optimization
    - Unique constraint on stripe_subscription_id

  4. Computed Fields
    - Add `is_active` computed field via view
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view with computed fields including is_active
CREATE OR REPLACE VIEW user_subscriptions AS
SELECT 
  s.*,
  -- Computed field: is_active
  CASE 
    WHEN s.status IN ('active', 'trialing') AND s.current_period_end > now() THEN true
    ELSE false
  END as is_active,
  -- Additional computed field: days_until_renewal
  CASE 
    WHEN s.current_period_end > now() THEN 
      EXTRACT(DAY FROM (s.current_period_end - now()))::integer
    ELSE 0
  END as days_until_renewal
FROM subscriptions s;

-- Grant access to the view
GRANT SELECT ON user_subscriptions TO authenticated;
GRANT ALL ON user_subscriptions TO service_role;