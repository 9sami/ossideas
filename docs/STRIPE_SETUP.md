# Stripe Integration Setup Guide

This guide will help you set up Stripe integration for OSSIdeas, including subscriptions and one-time payments.

## Prerequisites

- Stripe account (sign up at [stripe.com](https://stripe.com))
- Supabase project with edge functions enabled
- Basic understanding of webhooks

## Step 1: Create Stripe Products and Prices

### 1.1 Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Products
2. Click "Add product" and create the following products:

**Basic Plan**
- Name: Basic
- Description: Perfect for individual entrepreneurs and small projects

**Pro Plan**
- Name: Pro  
- Description: Ideal for serious entrepreneurs and growing teams

**Market Report**
- Name: Market Report
- Description: One-time purchase of comprehensive market analysis

### 1.2 Create Prices for Each Product

For each product, create prices with the following details:

**Basic Plan Prices:**
- Monthly: $10.00 USD, recurring monthly
- Yearly: $80.00 USD, recurring yearly (20% discount)

**Pro Plan Prices:**
- Monthly: $20.00 USD, recurring monthly  
- Yearly: $160.00 USD, recurring yearly (20% discount)

**Market Report Price:**
- One-time: $49.99 USD, one-time payment

### 1.3 Copy Price IDs

After creating each price, copy the Price ID (starts with `price_`) and update `src/stripe-config.ts`:

```typescript
export const stripeProducts: StripeProduct[] = [
  {
    id: 'basic-monthly',
    priceId: 'price_1234567890abcdef', // Replace with your actual price ID
    name: 'Basic',
    // ... rest of configuration
  },
  // ... other products
];
```

## Step 2: Configure Webhook Endpoint

### 2.1 Create Webhook in Stripe

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-project-id.supabase.co/functions/v1/stripe-webhook`
4. Select the following events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`

### 2.2 Get Webhook Secret

1. After creating the webhook, click on it
2. Copy the "Signing secret" (starts with `whsec_`)
3. Add it to your Supabase edge function environment variables

## Step 3: Set Environment Variables

### 3.1 Supabase Edge Function Secrets

Set the following secrets in your Supabase project:

```bash
# Using Supabase CLI
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Or set them in the Supabase dashboard under Settings → Edge Functions.

### 3.2 Frontend Environment Variables

Update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test the Integration

### 4.1 Test Subscription Flow

1. Start your development server: `npm run dev`
2. Navigate to `/pricing`
3. Sign up for an account
4. Try purchasing a subscription plan
5. Use Stripe test card: `4242 4242 4242 4242`

### 4.2 Test Webhook Processing

1. Complete a test purchase
2. Check Supabase logs for edge function execution
3. Verify data is correctly stored in database tables:
   - `stripe_customers`
   - `stripe_subscriptions` 
   - `stripe_orders`

### 4.3 Test Success Page

After successful payment, users should be redirected to `/success` with order details.

## Step 5: Production Setup

### 5.1 Switch to Live Mode

1. In Stripe Dashboard, toggle to "Live mode"
2. Create the same products and prices in live mode
3. Update `stripe-config.ts` with live price IDs
4. Update webhook endpoint to use production URL
5. Update environment variables with live keys

### 5.2 Security Checklist

- [ ] Webhook endpoint uses HTTPS
- [ ] Webhook signature verification is enabled
- [ ] Stripe secret keys are stored securely
- [ ] Database has proper RLS policies
- [ ] Error handling is implemented
- [ ] Logging is configured for monitoring

## Troubleshooting

### Common Issues

**Webhook not receiving events:**
- Check webhook URL is correct
- Verify endpoint is publicly accessible
- Check Supabase edge function logs

**Payment not completing:**
- Verify price IDs are correct
- Check Stripe dashboard for failed payments
- Review browser console for errors

**Database errors:**
- Check RLS policies allow proper access
- Verify user authentication is working
- Review Supabase logs

### Testing Cards

Use these test cards for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## Support

For additional help:
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- Create an issue in this repository