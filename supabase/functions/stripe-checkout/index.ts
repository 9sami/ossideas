import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'OSSIdeas Integration',
    version: '1.0.0',
  },
});

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse(null, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Parse request body
    const { price_id, success_url, cancel_url } = await req.json();

    // Validate parameters
    if (!price_id || !success_url || !cancel_url) {
      return corsResponse({ error: 'Missing required parameters: price_id, success_url, cancel_url' }, 400);
    }

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return corsResponse({ error: 'Missing or invalid authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if (getUserError || !user) {
      console.error('Authentication failed:', getUserError);
      return corsResponse({ error: 'Authentication failed' }, 401);
    }

    console.log(`Processing checkout for user: ${user.id}, email: ${user.email}, price: ${price_id}`);

    // Check if customer already exists in our database
    const { data: existingCustomer, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (customerError) {
      console.error('Error checking existing customer:', customerError);
      return corsResponse({ error: 'Database error checking customer' }, 500);
    }

    let customerId: string;

    if (existingCustomer?.customer_id) {
      // Use existing customer
      customerId = existingCustomer.customer_id;
      console.log(`Using existing Stripe customer: ${customerId}`);

      // Verify the customer still exists in Stripe
      try {
        await stripe.customers.retrieve(customerId);
      } catch (stripeError) {
        console.error('Existing Stripe customer not found, creating new one:', stripeError);
        
        // Mark old customer as deleted and create new one
        await supabase
          .from('stripe_customers')
          .update({ deleted_at: new Date().toISOString() })
          .eq('user_id', user.id);

        // Create new customer (will be handled below)
        existingCustomer.customer_id = null;
      }
    }

    if (!existingCustomer?.customer_id) {
      // Create new Stripe customer
      try {
        const stripeCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        
        customerId = stripeCustomer.id;
        console.log(`Created new Stripe customer: ${customerId}`);

        // Save to database
        const { error: dbError } = await supabase
          .from('stripe_customers')
          .insert({
            user_id: user.id,
            customer_id: customerId,
          });

        if (dbError) {
          console.error('Database error saving customer:', dbError);
          
          // Clean up Stripe customer
          try {
            await stripe.customers.del(customerId);
          } catch (cleanupError) {
            console.error('Failed to cleanup Stripe customer:', cleanupError);
          }
          
          return corsResponse({ error: 'Database error saving customer' }, 500);
        }
        
        console.log(`Saved customer ${customerId} to database`);
      } catch (error) {
        console.error('Failed to create Stripe customer:', error);
        return corsResponse({ error: 'Failed to create customer in Stripe' }, 500);
      }
    }

    // Check if user has an existing active subscription
    const { data: existingSubscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, stripe_price_id, plan_name')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle();

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', subError);
      return corsResponse({ error: 'Database error checking subscription' }, 500);
    }

    // If user has an existing subscription, modify it instead of creating a new checkout
    if (existingSubscription?.stripe_subscription_id) {
      console.log(`User has existing subscription: ${existingSubscription.stripe_subscription_id}`);
      
      // Check if they're trying to subscribe to the same plan
      if (existingSubscription.stripe_price_id === price_id) {
        return corsResponse({ error: 'You are already subscribed to this plan' }, 400);
      }

      try {
        // Retrieve the current subscription from Stripe
        const subscription = await stripe.subscriptions.retrieve(existingSubscription.stripe_subscription_id);
        
        // Update the subscription to the new price
        const updatedSubscription = await stripe.subscriptions.update(existingSubscription.stripe_subscription_id, {
          items: [{
            id: subscription.items.data[0].id,
            price: price_id,
          }],
          proration_behavior: 'create_prorations',
          metadata: {
            userId: user.id,
            upgraded_from: existingSubscription.plan_name,
          },
        });

        console.log(`Successfully updated subscription ${existingSubscription.stripe_subscription_id} to price ${price_id}`);

        // Return success URL directly since the subscription was updated
        return corsResponse({
          url: success_url.replace('{CHECKOUT_SESSION_ID}', `sub_${updatedSubscription.id}`),
          subscriptionId: updatedSubscription.id,
          message: 'Subscription updated successfully'
        });

      } catch (error) {
        console.error('Failed to update existing subscription:', error);
        return corsResponse({ 
          error: `Failed to update subscription: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, 500);
      }
    }

    // Verify the price exists
    try {
      await stripe.prices.retrieve(price_id);
    } catch (error) {
      console.error('Invalid price ID:', error);
      return corsResponse({ error: `Invalid price ID: ${price_id}` }, 400);
    }

    // Create checkout session for new subscription
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url,
        cancel_url,
        subscription_data: {
          metadata: {
            userId: user.id,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
      });

      console.log(`Created checkout session: ${session.id}`);

      return corsResponse({
        sessionId: session.id,
        url: session.url,
      });

    } catch (error) {
      console.error('Failed to create checkout session:', error);
      return corsResponse({ 
        error: `Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }, 500);
    }

  } catch (error) {
    console.error('Unexpected error in checkout function:', error);
    return corsResponse({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, 500);
  }
});