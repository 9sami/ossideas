/*
  # Enable Real-time Updates for Subscriptions

  1. Changes Made
    - Add subscriptions table to supabase_realtime publication
    - This enables real-time updates for subscription changes
    - Frontend listeners will now receive immediate updates when subscriptions change

  2. Benefits
    - No more manual page refreshes needed
    - Instant UI updates when subscription plans change
    - Better user experience with real-time feedback

  3. Security
    - Real-time updates respect existing RLS policies
    - Only authenticated users can receive updates for their own subscriptions
*/

-- Add subscriptions table to real-time publication
-- This enables real-time updates for subscription changes
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;

-- Add a comment to document this change
COMMENT ON TABLE subscriptions IS 'Subscription data with real-time updates enabled for immediate UI synchronization';