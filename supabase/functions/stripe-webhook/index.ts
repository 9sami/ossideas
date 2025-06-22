import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'OSSIdeas Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return new Response(`Webhook signature verification failed: ${errorMessage}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', errorMessage);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
    return;
  }

  // Handle subscription events
  if (event.type === 'checkout.session.completed') {
    const session = stripeData as Stripe.Checkout.Session;
    if (session.mode === 'subscription') {
      console.info(`Processing subscription checkout session for customer: ${customerId}`);
      await syncSubscriptionFromStripe(customerId);
    }
  } else if (event.type === 'customer.subscription.created' || 
             event.type === 'customer.subscription.updated' ||
             event.type === 'customer.subscription.deleted') {
    console.info(`Processing subscription event ${event.type} for customer: ${customerId}`);
    await syncSubscriptionFromStripe(customerId);
  }
}

async function syncSubscriptionFromStripe(customerId: string) {
  try {
    // Get customer details to find user_id
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .is('deleted_at', null)
      .single();

    if (customerError || !customerData) {
      console.error('Failed to find customer in database:', customerError);
      return;
    }

    // Fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      return;
    }

    // Get the subscription (assuming one subscription per customer)
    const subscription = subscriptions.data[0];
    const priceItem = subscription.items.data[0];

    // Get price details to determine plan name and interval
    const price = await stripe.prices.retrieve(priceItem.price.id);
    
    // Determine plan name from price metadata or product name
    let planName = 'Basic';
    let planInterval = 'month';
    
    if (price.metadata.plan_name) {
      planName = price.metadata.plan_name;
    } else if (price.metadata.plan) {
      planName = price.metadata.plan;
    }
    
    if (price.recurring?.interval) {
      planInterval = price.recurring.interval;
    }

    // Upsert subscription data
    const { error: subError } = await supabase.from('subscriptions').upsert(
      {
        user_id: customerData.user_id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceItem.price.id,
        plan_name: planName,
        plan_interval: planInterval,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        payment_method_brand: subscription.default_payment_method && 
          typeof subscription.default_payment_method !== 'string' 
            ? subscription.default_payment_method.card?.brand ?? null 
            : null,
        payment_method_last4: subscription.default_payment_method && 
          typeof subscription.default_payment_method !== 'string' 
            ? subscription.default_payment_method.card?.last4 ?? null 
            : null,
        amount_cents: priceItem.price.unit_amount ?? 0,
        currency: priceItem.price.currency ?? 'usd',
      },
      {
        onConflict: 'stripe_subscription_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to sync subscription for customer ${customerId}:`, errorMessage);
    throw error;
  }
}