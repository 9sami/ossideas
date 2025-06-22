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
        await handleSubscriptionEvent(stripeData as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeData as Stripe.Subscription);
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

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Processing subscription deletion for: ${subscription.id}`);
  
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
      return;
    }

    // Update subscription status to canceled instead of deleting
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    if (updateError) {
      console.error('Error updating canceled subscription:', updateError);
      throw new Error(`Failed to update canceled subscription: ${updateError.message}`);
    }

    console.log(`Successfully marked subscription ${subscription.id} as canceled`);
  } catch (error) {
    console.error(`Failed to handle subscription deletion ${subscription.id}:`, error);
    throw error;
  }
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
    } else {
      // Fallback: determine from price amount
      const amount = price.unit_amount || 0;
      if (amount >= 2000) {
        planName = 'Pro';
      } else {
        planName = 'Basic';
      }
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

    // First, check if this is an existing subscription update
    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id')
      .eq('stripe_subscription_id', subscription.id)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      throw new Error(`Failed to check existing subscription: ${checkError.message}`);
    }

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('stripe_subscription_id', subscription.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }

      console.log(`Successfully updated existing subscription: ${subscription.id} for user: ${customerData.user_id}`);
    } else {
      // This is a new subscription, but first cancel any existing active subscriptions for this user
      // to prevent multiple active subscriptions
      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', customerData.user_id)
        .in('status', ['active', 'trialing', 'past_due']);

      if (cancelError) {
        console.error('Error canceling existing subscriptions:', cancelError);
        // Don't throw here, just log the error and continue
      } else {
        console.log(`Canceled existing subscriptions for user: ${customerData.user_id}`);
      }

      // Insert new subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);

      if (insertError) {
        console.error('Error inserting subscription:', insertError);
        throw new Error(`Failed to insert subscription: ${insertError.message}`);
      }

      console.log(`Successfully created new subscription: ${subscription.id} for user: ${customerData.user_id}`);
    }

  } catch (error) {
    console.error(`Failed to sync subscription ${subscription.id}:`, error);
    throw error;
  }
}