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
