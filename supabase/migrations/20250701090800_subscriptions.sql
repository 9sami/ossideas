/*
  # Create subscriptions table

  1. New Table
    - `subscriptions`: Manages user subscription details and links to billing information for premium access control.
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL,
  plan_type varchar(50) NOT NULL,
  stripe_subscription_id varchar(255) UNIQUE,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  canceled_at timestamptz
); 