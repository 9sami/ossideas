# Webhook Testing & Subscription Data Guide

## 🎯 **Current Status**

✅ **Webhook Function**: Deployed and working (shutdown event is normal)  
✅ **Events Listening**: `checkout.session.completed`, `checkout.session.expired`  
✅ **Signature Verification**: Fixed with proper request body handling

## 🧪 **Testing Your Webhook**

### Step 1: Update Webhook Secret

Edit `test-webhook-events.js` and replace:

```javascript
const WEBHOOK_SECRET = 'whsec_your_webhook_secret_here';
```

With your actual webhook secret from Stripe dashboard.

### Step 2: Run Webhook Tests

```bash
node test-webhook-events.js
```

### Step 3: Check Function Logs

```bash
supabase functions logs stripe-webhook --follow
```

## 📊 **Adding Subscription Data**

### Option 1: Use SQL Script (Recommended)

Create a file `add-subscriptions.sql`:

```sql
-- Get your actual user IDs first
SELECT id as user_id, email FROM auth.users ORDER BY created_at DESC;

-- Then add sample subscriptions (replace user_id with actual UUIDs)
INSERT INTO subscriptions (
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  stripe_price_id,
  plan_name,
  plan_interval,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  payment_method_brand,
  payment_method_last4,
  amount_cents,
  currency
) VALUES
(
  'your-actual-user-id-here',
  'cus_sample_001',
  'sub_sample_001',
  'price_1RetLjLSoWUjpqIF9wkLYgbF', -- Basic Monthly
  'Basic',
  'month',
  'active',
  NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '15 days',
  false,
  'visa',
  '4242',
  1000,
  'usd'
);

-- Also add stripe_customers record
INSERT INTO stripe_customers (user_id, customer_id) VALUES
('your-actual-user-id-here', 'cus_sample_001')
ON CONFLICT (customer_id) DO NOTHING;
```

### Option 2: Use Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select the `subscriptions` table
4. Add rows manually with your data

## 🔍 **Verifying Data**

### Check Subscriptions Table

```sql
SELECT
  id,
  user_id,
  plan_name,
  plan_interval,
  status,
  current_period_start,
  current_period_end,
  amount_cents,
  currency
FROM subscriptions
ORDER BY created_at DESC;
```

### Check User Subscriptions View

```sql
SELECT
  id,
  user_id,
  plan_name,
  status,
  is_active,
  days_until_renewal,
  amount_cents
FROM user_subscriptions
ORDER BY created_at DESC;
```

### Check Stripe Customers

```sql
SELECT
  user_id,
  customer_id,
  created_at
FROM stripe_customers
ORDER BY created_at DESC;
```

## 🚀 **Real Stripe Testing**

### Using Stripe CLI (Recommended)

```bash
# Install Stripe CLI if you haven't
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local environment
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger checkout.session.expired
```

### Using Stripe Dashboard

1. Go to Stripe Dashboard → Webhooks
2. Find your webhook endpoint
3. Click "Send test webhook"
4. Select `checkout.session.completed` or `checkout.session.expired`
5. Send the test event

## 📋 **Expected Webhook Behavior**

### `checkout.session.completed`

- ✅ Logs the session details
- ✅ Fetches full subscription from Stripe
- ✅ Syncs subscription to database
- ✅ Creates/updates subscription record

### `checkout.session.expired`

- ✅ Logs the expired session
- ✅ No database changes (as expected)
- ✅ Could trigger user notifications

## 🔧 **Troubleshooting**

### Common Issues

**1. "No signature found"**

- Check that `Stripe-Signature` header is present
- Verify webhook secret is correct

**2. "Signature verification failed"**

- Ensure webhook secret matches Stripe dashboard
- Check that request body is preserved exactly

**3. "Customer not found"**

- Make sure `stripe_customers` table has the customer record
- Verify `customer_id` matches between Stripe and your database

**4. "Subscription not created"**

- Check that user exists in `auth.users`
- Verify RLS policies allow service role access
- Check function logs for detailed error messages

### Debug Commands

```bash
# Check function logs
supabase functions logs stripe-webhook --follow

# Check database tables
supabase db diff

# Test webhook locally
supabase functions serve stripe-webhook --env-file .env.local

# Deploy function
supabase functions deploy stripe-webhook
```

## 📈 **Monitoring**

### Key Metrics to Watch

- Webhook delivery success rate
- Subscription creation success rate
- Function execution time
- Error rates and types

### Log Analysis

Look for these log patterns:

- `Webhook signature verified successfully`
- `Processing checkout session completed`
- `Successfully created new subscription`
- `Error processing subscription`

## 🎉 **Success Indicators**

✅ Webhook receives events without signature errors  
✅ Subscription data appears in database  
✅ User subscription status updates correctly  
✅ No duplicate subscriptions created  
✅ Proper error handling and logging

---

**Need Help?** Check the function logs first, then refer to the troubleshooting section above.

# Stripe Webhook Testing Guide

## Overview

This guide helps you test and debug the Stripe webhook, especially for yearly subscription issues.

## Enhanced Logging

The webhook now includes comprehensive logging to help debug issues:

### Event Processing Logs

- Event type and ID
- Event data structure
- Processing status for each event type

### Subscription Sync Logs

- Subscription status and customer information
- Price details including metadata and recurring settings
- Plan detection logic (Basic/Pro, monthly/yearly)
- Database operation results

### Error Handling

- Detailed error messages with codes and hints
- Failed operation data for debugging
- Customer lookup results

## Testing Steps

### 1. Check Webhook Endpoint

Verify your webhook endpoint is correctly configured in Stripe Dashboard:

- Go to Stripe Dashboard > Developers > Webhooks
- Ensure the endpoint points to: `https://your-project.supabase.co/functions/v1/stripe-webhook`
- Verify the webhook secret is set in your environment variables

### 2. Monitor Webhook Logs

Check the Supabase Edge Functions logs:

```bash
supabase functions logs stripe-webhook --follow
```

### 3. Test Yearly Subscription Flow

1. Create a yearly subscription through your checkout
2. Monitor the logs for these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `invoice.payment_succeeded`

### 4. Expected Log Output for Yearly Subscription

```
Processing event: checkout.session.completed - evt_xxx
Processing checkout.session.completed event
Processing checkout session completed: cs_xxx
Session details: { mode: 'subscription', subscription: 'sub_xxx', customer: 'cus_xxx', payment_status: 'paid' }
Processing subscription checkout session: cs_xxx
Syncing subscription sub_xxx to database (context: checkout_completed)
Subscription status: active
Subscription customer: cus_xxx
Subscription items count: 1
Found customer data for user: xxx-xxx-xxx
Processing subscription with price: price_xxx, amount: 24000
Price object: { id: 'price_xxx', unit_amount: 24000, currency: 'usd', recurring: { interval: 'year' }, metadata: {} }
Detected yearly subscription with plan: Pro
Determined plan: Pro, interval: year
Price metadata: {}
Price recurring: { interval: 'year' }
Creating new subscription: sub_xxx
Successfully created new subscription: sub_xxx for user: xxx-xxx-xxx
```

### 5. Common Issues and Solutions

#### Issue: "No such customer" error

**Solution**: The checkout function now handles this by creating a new customer if the existing one is invalid.

#### Issue: Webhook not receiving events

**Solutions**:

- Check webhook endpoint URL is correct
- Verify webhook secret is set correctly
- Check Stripe Dashboard for webhook delivery failures
- Ensure the webhook is enabled for the required events

#### Issue: Database sync failures

**Solutions**:

- Check database schema matches the expected structure
- Verify RLS policies allow service role access
- Check for constraint violations in the logs

#### Issue: Yearly subscription not detected

**Solutions**:

- Check price metadata in Stripe Dashboard
- Verify the price has `recurring.interval` set to "year"
- Check the plan detection logic in the logs

### 6. Manual Testing with Stripe CLI

Install Stripe CLI and test locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local endpoint
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

### 7. Database Verification

Check if the subscription was created in your database:

```sql
-- Check subscriptions table
SELECT * FROM subscriptions WHERE stripe_subscription_id = 'sub_xxx';

-- Check user subscriptions view
SELECT * FROM user_subscriptions WHERE user_id = 'xxx-xxx-xxx';
```

### 8. Environment Variables

Ensure these are set in your Supabase project:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting Checklist

- [ ] Webhook endpoint is accessible
- [ ] Webhook secret is correct
- [ ] Required events are enabled in Stripe Dashboard
- [ ] Database schema is up to date
- [ ] RLS policies allow service role access
- [ ] Environment variables are set correctly
- [ ] No webhook delivery failures in Stripe Dashboard
- [ ] Logs show successful event processing
- [ ] Database contains the expected subscription record

## Support

If you're still experiencing issues:

1. Check the enhanced logs for specific error messages
2. Verify the webhook is receiving events in Stripe Dashboard
3. Test with Stripe CLI to isolate the issue
4. Check database constraints and RLS policies
