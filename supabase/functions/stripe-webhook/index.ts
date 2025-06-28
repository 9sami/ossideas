import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@18.0.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'OSSIdeas Integration',
    version: '1.0.0',
  },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

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
      console.error('No Stripe signature found in headers');
      return new Response(JSON.stringify({ error: 'No signature found' }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }

    // Get the raw body - try multiple approaches for compatibility
    let body: string;
    let rawBody: Uint8Array;

    try {
      // First try to get the body as text and encode it
      body = await req.text();
      rawBody = new TextEncoder().encode(body);
    } catch (error) {
      console.error('Error reading request body as text:', error);
      // Fallback to arrayBuffer
      const buffer = await req.arrayBuffer();
      rawBody = new Uint8Array(buffer);
      body = new TextDecoder().decode(rawBody);
    }

    console.log('Webhook received:', {
      signature: signature.substring(0, 20) + '...',
      bodyLength: body.length,
      contentType: req.headers.get('content-type'),
      userAgent: req.headers.get('user-agent'),
      bodyPreview: body.substring(0, 100) + '...',
    });

    // Verify the webhook signature using Stripe SDK
    let event: Stripe.Event;

    try {
      // Use the raw body buffer for signature verification
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        stripeWebhookSecret,
      );
      console.log(
        `Webhook signature verified successfully for event: ${event.type}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      console.error('Webhook details:', {
        signatureLength: signature.length,
        bodyLength: body.length,
        webhookSecretLength: stripeWebhookSecret.length,
        webhookSecretPrefix: stripeWebhookSecret.substring(0, 10) + '...',
        signatureHeader: signature,
        bodyStart: body.substring(0, 200),
      });

      // Try alternative verification method as fallback
      try {
        console.log('Attempting alternative verification method...');
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          stripeWebhookSecret,
        );
        console.log(
          `Alternative verification successful for event: ${event.type}`,
        );
      } catch (fallbackError: unknown) {
        const fallbackErrorMessage =
          fallbackError instanceof Error
            ? fallbackError.message
            : 'Unknown error';
        console.error(
          `Alternative verification also failed: ${fallbackErrorMessage}`,
        );

        return new Response(
          JSON.stringify({
            error: `Webhook signature verification failed: ${errorMessage}`,
            fallbackError: fallbackErrorMessage,
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
            status: 400,
          },
        );
      }
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return new Response(JSON.stringify({ received: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  console.log(`Processing event: ${event.type} - ${event.id}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          stripeData as Stripe.Checkout.Session,
        );
        break;

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(
          stripeData as Stripe.Checkout.Session,
        );
        break;

      case 'customer.subscription.created':
        console.log('Subscription created event');
        await handleSubscriptionEvent(
          stripeData as Stripe.Subscription,
          'created',
        );
        break;

      case 'customer.subscription.updated':
        console.log('Subscription updated event');
        await handleSubscriptionEvent(
          stripeData as Stripe.Subscription,
          'updated',
        );
        break;

      case 'customer.subscription.deleted':
        console.log('Subscription deleted event');
        await handleSubscriptionDeleted(stripeData as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        console.log('Invoice payment succeeded');
        await handleInvoicePaymentSucceeded(stripeData as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        console.log('Invoice payment failed');
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

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  console.log(`Processing checkout session completed: ${session.id}`);
  console.log('Session details:', {
    mode: session.mode,
    subscription: session.subscription,
    customer: session.customer,
    payment_status: session.payment_status,
  });

  if (session.mode === 'subscription' && session.subscription) {
    console.log(`Processing subscription checkout session: ${session.id}`);

    try {
      // Fetch the full subscription object with expanded data
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
        {
          expand: [
            'default_payment_method',
            'items.data.price',
            'items.data.price.product',
          ],
        },
      );

      await syncSubscriptionToDatabase(subscription, 'checkout_completed');
    } catch (error) {
      console.error(
        `Error processing subscription for checkout session ${session.id}:`,
        error,
      );
      throw error;
    }
  } else {
    console.log(
      `Checkout session ${session.id} is not a subscription or missing subscription data`,
    );
  }
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  console.log(`Processing checkout session expired: ${session.id}`);

  // For expired sessions, we might want to clean up any pending subscription data
  // or notify the user that their checkout session has expired
  try {
    if (session.metadata?.userId) {
      console.log(
        `Checkout session expired for user: ${session.metadata.userId}`,
      );

      // You could add logic here to:
      // 1. Send an email to the user about the expired session
      // 2. Clean up any temporary subscription data
      // 3. Update user status if needed

      console.log(
        `Checkout session ${session.id} expired - no action needed for now`,
      );
    }
  } catch (error) {
    console.error(
      `Error processing expired checkout session ${session.id}:`,
      error,
    );
    // Don't throw error for expired sessions as they're not critical
  }
}

async function handleSubscriptionEvent(
  subscription: Stripe.Subscription,
  eventType: string,
) {
  console.log(`Processing subscription ${eventType} for: ${subscription.id}`);

  // Always fetch the latest subscription data with expanded fields
  const fullSubscription = await stripe.subscriptions.retrieve(
    subscription.id,
    {
      expand: [
        'default_payment_method',
        'items.data.price',
        'items.data.price.product',
      ],
    },
  );

  await syncSubscriptionToDatabase(fullSubscription, eventType);
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
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (updateError) {
      console.error('Error updating canceled subscription:', updateError);
      throw new Error(
        `Failed to update canceled subscription: ${updateError.message}`,
      );
    }

    console.log(
      `Successfully marked subscription ${subscription.id} as canceled`,
    );
  } catch (error) {
    console.error(
      `Failed to handle subscription deletion ${subscription.id}:`,
      error,
    );
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    console.log(
      `Processing successful payment for subscription: ${invoice.subscription}`,
    );

    // Fetch the subscription and sync to ensure payment method is updated
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
      {
        expand: [
          'default_payment_method',
          'items.data.price',
          'items.data.price.product',
        ],
      },
    );

    await syncSubscriptionToDatabase(subscription, 'payment_succeeded');
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    console.log(
      `Processing failed payment for subscription: ${invoice.subscription}`,
    );

    // Fetch the subscription to get updated status
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
      {
        expand: [
          'default_payment_method',
          'items.data.price',
          'items.data.price.product',
        ],
      },
    );

    await syncSubscriptionToDatabase(subscription, 'payment_failed');
  }
}

async function syncSubscriptionToDatabase(
  subscription: Stripe.Subscription,
  eventContext: string,
) {
  try {
    console.log(
      `Syncing subscription ${subscription.id} to database (context: ${eventContext})`,
    );

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
      throw new Error(
        `No subscription items found for subscription: ${subscription.id}`,
      );
    }

    const price = subscriptionItem.price;
    console.log(
      `Processing subscription with price: ${price.id}, amount: ${price.unit_amount}`,
    );

    // Extract plan information from price metadata or determine from amount
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
        // $20.00 or more
        planName = 'Pro';
      } else {
        planName = 'Basic';
      }
    }

    if (price.recurring?.interval) {
      planInterval = price.recurring.interval;
    }

    console.log(`Determined plan: ${planName}, interval: ${planInterval}`);

    // Log timestamp values for debugging
    console.log(`Subscription timestamps:`, {
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      created: subscription.created,
      start_date: subscription.start_date,
    });

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
      current_period_start: (() => {
        try {
          return subscription.current_period_start
            ? new Date(subscription.current_period_start * 1000).toISOString()
            : null;
        } catch (error) {
          console.error(
            'Error converting current_period_start:',
            error,
            'Value:',
            subscription.current_period_start,
          );
          return null;
        }
      })(),
      current_period_end: (() => {
        try {
          return subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null;
        } catch (error) {
          console.error(
            'Error converting current_period_end:',
            error,
            'Value:',
            subscription.current_period_end,
          );
          return null;
        }
      })(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      payment_method_brand: paymentMethodBrand,
      payment_method_last4: paymentMethodLast4,
      amount_cents: price.unit_amount || 0,
      currency: price.currency || 'usd',
      updated_at: new Date().toISOString(),
    };

    console.log(`Subscription data to sync:`, {
      subscription_id: subscriptionData.stripe_subscription_id,
      price_id: subscriptionData.stripe_price_id,
      plan_name: subscriptionData.plan_name,
      status: subscriptionData.status,
      amount_cents: subscriptionData.amount_cents,
    });

    // Check if this subscription already exists in our database
    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id, stripe_price_id, plan_name, status')
      .eq('stripe_subscription_id', subscription.id)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      throw new Error(
        `Failed to check existing subscription: ${checkError.message}`,
      );
    }

    if (existingSubscription) {
      console.log(`Updating existing subscription: ${subscription.id}`);
      console.log(`Previous data:`, {
        price_id: existingSubscription.stripe_price_id,
        plan_name: existingSubscription.plan_name,
        status: existingSubscription.status,
      });

      // Update existing subscription
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('stripe_subscription_id', subscription.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw new Error(
          `Failed to update subscription: ${updateError.message}`,
        );
      }

      console.log(
        `Successfully updated subscription: ${subscription.id} for user: ${customerData.user_id}`,
      );
    } else {
      console.log(`Creating new subscription: ${subscription.id}`);

      // This is a new subscription
      // First, cancel any existing active subscriptions for this user to prevent multiple active subscriptions
      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', customerData.user_id)
        .in('status', ['active', 'trialing', 'past_due'])
        .neq('stripe_subscription_id', subscription.id); // Don't cancel the current subscription

      if (cancelError) {
        console.error('Error canceling existing subscriptions:', cancelError);
        // Don't throw here, just log the error and continue
      } else {
        console.log(
          `Canceled existing subscriptions for user: ${customerData.user_id}`,
        );
      }

      // Insert new subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);

      if (insertError) {
        console.error('Error inserting subscription:', insertError);
        throw new Error(
          `Failed to insert subscription: ${insertError.message}`,
        );
      }

      console.log(
        `Successfully created new subscription: ${subscription.id} for user: ${customerData.user_id}`,
      );
    }
  } catch (error) {
    console.error(`Failed to sync subscription ${subscription.id}:`, error);
    throw error;
  }
}
