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

    // Always create a fresh Stripe customer for simplicity
    // This avoids all the complexity with stale customer records
    let stripeCustomer;
    try {
      stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      console.log(`Created new Stripe customer: ${stripeCustomer.id}`);
    } catch (error) {
      console.error('Failed to create Stripe customer:', error);
      return corsResponse({ error: 'Failed to create customer in Stripe' }, 500);
    }

    // Save customer to database
    try {
      const { error: dbError } = await supabase
        .from('stripe_customers')
        .insert({
          user_id: user.id,
          customer_id: stripeCustomer.id,
        });

      if (dbError) {
        console.error('Database error saving customer:', dbError);
        
        // Clean up Stripe customer
        try {
          await stripe.customers.del(stripeCustomer.id);
        } catch (cleanupError) {
          console.error('Failed to cleanup Stripe customer:', cleanupError);
        }
        
        return corsResponse({ error: 'Database error saving customer' }, 500);
      }
      
      console.log(`Saved customer ${stripeCustomer.id} to database`);
    } catch (error) {
      console.error('Unexpected error saving customer:', error);
      return corsResponse({ error: 'Unexpected error saving customer' }, 500);
    }

    // Verify the price exists
    try {
      await stripe.prices.retrieve(price_id);
    } catch (error) {
      console.error('Invalid price ID:', error);
      return corsResponse({ error: `Invalid price ID: ${price_id}` }, 400);
    }

    // Create checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.id,
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