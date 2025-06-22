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

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // Get the raw body
    const body = await req.text();

    // Verify the webhook signature
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

  console.log(`Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(stripeData as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(stripeData as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(stripeData as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(stripeData as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error handling event ${event.type}:`, error);
    throw error;
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (session.mode === 'subscription' && session.subscription) {
    console.log(`Processing subscription checkout session: ${session.id}`);
    
    // Fetch the full subscription object
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
      expand: ['default_payment_method', 'items.data.price']
    });
    
    await syncSubscriptionToDatabase(subscription);
  }
}

async function handleSubscriptionEvent(subscription: Stripe.Subscription) {
  console.log(`Processing subscription event for: ${subscription.id}`);
  await syncSubscriptionToDatabase(subscription);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    console.log(`Processing successful payment for subscription: ${invoice.subscription}`);
    
    // Fetch the subscription and sync to ensure payment method is updated
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string, {
      expand: ['default_payment_method']
    });
    
    await syncSubscriptionToDatabase(subscription);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    console.log(`Processing failed payment for subscription: ${invoice.subscription}`);
    
    // Fetch the subscription to get updated status
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await syncSubscriptionToDatabase(subscription);
  }
}

async function syncSubscriptionToDatabase(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    // Get user_id from stripe_customers table
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .is('deleted_at', null)
      .single();

    if (customerError || !customerData) {
      console.error('Failed to find customer in database:', customerError);
      throw new Error(`Customer not found: ${customerId}`);
    }

    // Get the primary subscription item (assuming one price per subscription)
    const subscriptionItem = subscription.items.data[0];
    if (!subscriptionItem) {
      throw new Error(`No subscription items found for subscription: ${subscription.id}`);
    }

    const price = subscriptionItem.price;
    
    // Extract plan information from price metadata or product
    let planName = 'Basic';
    let planInterval = 'month';
    
    // Try to get plan info from price metadata first
    if (price.metadata?.plan_name) {
      planName = price.metadata.plan_name;
    } else if (price.metadata?.plan) {
      planName = price.metadata.plan;
    }
    
    if (price.recurring?.interval) {
      planInterval = price.recurring.interval;
    }

    // Get payment method details
    let paymentMethodBrand: string | null = null;
    let paymentMethodLast4: string | null = null;
    
    if (subscription.default_payment_method) {
      const paymentMethod = subscription.default_payment_method;
      if (typeof paymentMethod === 'object' && paymentMethod.card) {
        paymentMethodBrand = paymentMethod.card.brand;
        paymentMethodLast4 = paymentMethod.card.last4;
      }
    }

    // Prepare subscription data
    const subscriptionData = {
      user_id: customerData.user_id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: price.id,
      plan_name: planName,
      plan_interval: planInterval,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      payment_method_brand: paymentMethodBrand,
      payment_method_last4: paymentMethodLast4,
      amount_cents: price.unit_amount || 0,
      currency: price.currency || 'usd',
      updated_at: new Date().toISOString()
    };

    // Upsert subscription data
    const { error: upsertError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'stripe_subscription_id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error('Error upserting subscription:', upsertError);
      throw new Error(`Failed to sync subscription: ${upsertError.message}`);
    }

    console.log(`Successfully synced subscription: ${subscription.id} for user: ${customerData.user_id}`);

    // If subscription is canceled or deleted, we might want to handle cleanup
    if (subscription.status === 'canceled') {
      console.log(`Subscription ${subscription.id} has been canceled`);
      // Additional cleanup logic can go here if needed
    }

  } catch (error) {
    console.error(`Failed to sync subscription ${subscription.id}:`, error);
    throw error;
  }
}