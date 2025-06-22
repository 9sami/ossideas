# Stripe Subscription Setup Instructions

## 🚨 IMPORTANT: You need to complete these steps for payments to work!

The current configuration uses placeholder price IDs that need to be replaced with real Stripe price IDs.

## Step 1: Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Products
2. Click "Add product" and create these products:

### Basic Plan
- **Name**: Basic
- **Description**: Perfect for individual entrepreneurs and small projects

### Pro Plan  
- **Name**: Pro
- **Description**: Ideal for serious entrepreneurs and growing teams

## Step 2: Create Prices for Each Product

For each product, create prices with these details:

### Basic Plan Prices:
1. **Monthly**: $10.00 USD, recurring monthly
2. **Yearly**: $80.00 USD, recurring yearly (20% discount)

### Pro Plan Prices:
1. **Monthly**: $20.00 USD, recurring monthly  
2. **Yearly**: $160.00 USD, recurring yearly (20% discount)

**Important**: When creating each price, add metadata to help identify the plan:
- Key: `plan_name`, Value: `Basic` or `Pro`
- Key: `plan_interval`, Value: `month` or `year`

## Step 3: Copy Price IDs and Update Configuration

After creating each price, copy the Price ID (starts with `price_`) and update `src/stripe-config.ts`:

```typescript
export const stripeProducts: StripeProduct[] = [
  {
    id: 'basic-monthly',
    priceId: 'price_1234567890abcdef', // Replace with your actual Basic Monthly price ID
    name: 'Basic',
    // ... rest stays the same
  },
  {
    id: 'pro-monthly', 
    priceId: 'price_abcdef1234567890', // Replace with your actual Pro Monthly price ID
    name: 'Pro',
    // ... rest stays the same
  },
  {
    id: 'basic-yearly',
    priceId: 'price_9876543210fedcba', // Replace with your actual Basic Yearly price ID
    name: 'Basic',
    // ... rest stays the same
  },
  {
    id: 'pro-yearly',
    priceId: 'price_fedcba0987654321', // Replace with your actual Pro Yearly price ID
    name: 'Pro', 
    // ... rest stays the same
  }
];
```

## Step 4: Set Up Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-project-id.supabase.co/functions/v1/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Step 5: Configure Environment Variables

Set these secrets in your Supabase project (Settings → Edge Functions):

```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Step 6: Test the Integration

1. Update the price IDs in `src/stripe-config.ts`
2. Test subscription flow with Stripe test card: `4242 4242 4242 4242`
3. Verify webhook processing in Supabase logs
4. Check that subscription data appears in the database

## Troubleshooting

### "No such price" error:
- Verify price IDs in `stripe-config.ts` match your Stripe dashboard
- Check that you're using test/live keys consistently
- Ensure prices are created in the correct Stripe mode (test/live)

### Database errors:
- Run the migration: The new migration should create the proper `subscriptions` table
- Check that the `user_subscriptions` view exists and is accessible
- Verify RLS policies allow proper access

### Webhook not receiving events:
- Check webhook URL is correct and publicly accessible
- Verify endpoint events are properly configured
- Check Supabase edge function logs for errors

## Production Checklist

- [ ] Products created in Stripe
- [ ] Prices created with correct amounts and intervals
- [ ] Price metadata added (`plan_name`, `plan_interval`)
- [ ] Price IDs updated in `stripe-config.ts`
- [ ] Webhook endpoint configured
- [ ] Environment variables set
- [ ] Test purchases completed successfully
- [ ] Database properly storing subscription data