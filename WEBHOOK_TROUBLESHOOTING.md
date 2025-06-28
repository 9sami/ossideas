# Stripe Webhook Signature Verification Troubleshooting

## Issue: "Webhook signature verification failed: No signatures found matching the expected signature for payload"

This error occurs when Stripe's webhook signature verification fails. Here's how to fix it:

## Step 1: Verify Environment Variables

Check that your webhook secret is correctly set:

```bash
# Check if the secret is set
supabase secrets list | grep STRIPE_WEBHOOK_SECRET

# If not set, set it with your actual webhook secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

**Important:** The webhook secret should start with `whsec_` and be copied directly from your Stripe dashboard.

## Step 2: Verify Webhook Endpoint URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Check that your webhook endpoint URL is correct:
   ```
   https://your-project-id.supabase.co/functions/v1/stripe-webhook
   ```
3. Ensure the endpoint is publicly accessible

## Step 3: Check Webhook Events

Make sure your webhook is configured to receive the correct events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Step 4: Test Webhook Signature

Use the test script to verify your webhook secret:

```bash
# Edit test-webhook.js with your actual webhook secret
node test-webhook.js
```

## Step 5: Check Request Body Preservation

The most common cause is that the request body isn't being preserved exactly as Stripe sent it. The fix I implemented:

1. **Uses `arrayBuffer()` instead of `text()`** to preserve exact byte format
2. **Passes `Uint8Array` to `constructEventAsync`** for proper signature verification
3. **Adds detailed logging** to help debug issues

## Step 6: Verify Stripe Mode

Ensure you're using the correct Stripe mode:

- **Test mode**: Use test webhook secret and test price IDs
- **Live mode**: Use live webhook secret and live price IDs

## Step 7: Check for Third-Party Interference

If you're using:

- **Load balancers**: Ensure they don't modify the request body
- **Reverse proxies**: Check they preserve the exact request format
- **CDNs**: Verify they don't compress or modify the payload

## Step 8: Monitor Webhook Logs

Check Supabase edge function logs:

```bash
supabase functions logs stripe-webhook --follow
```

Look for:

- Request body length
- Signature header presence
- Webhook secret length
- Any parsing errors

## Step 9: Manual Testing

1. **Use Stripe CLI** to test webhooks locally:

   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
   ```

2. **Check webhook delivery** in Stripe dashboard:
   - Go to Webhooks → Your endpoint → Recent deliveries
   - Check for failed deliveries and error messages

## Step 10: Common Solutions

### Solution 1: Update Webhook Secret

If you regenerated your webhook secret, update it in Supabase:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_new_secret_here
```

### Solution 2: Redeploy Function

After updating secrets, redeploy the function:

```bash
supabase functions deploy stripe-webhook
```

### Solution 3: Check Content-Type

Ensure the webhook sends `application/json` content type.

### Solution 4: Verify Timestamp Tolerance

The webhook signature includes a timestamp. If your server clock is significantly off, verification may fail.

## Debugging Checklist

- [ ] Webhook secret is correctly set and starts with `whsec_`
- [ ] Webhook endpoint URL is correct and accessible
- [ ] Request body is preserved exactly (using `arrayBuffer()`)
- [ ] Stripe mode (test/live) matches your configuration
- [ ] No third-party tools are modifying the request
- [ ] Server clock is synchronized
- [ ] Webhook events are properly configured
- [ ] Function is deployed with latest changes

## Still Having Issues?

1. **Check Stripe Dashboard**: Look for webhook delivery failures
2. **Review Logs**: Check Supabase function logs for detailed error messages
3. **Test Locally**: Use Stripe CLI to test webhook delivery
4. **Contact Support**: If issues persist, check Stripe's webhook documentation

## Useful Commands

```bash
# Check environment variables
supabase secrets list

# Deploy function
supabase functions deploy stripe-webhook

# View logs
supabase functions logs stripe-webhook --follow

# Test locally with Stripe CLI
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```
