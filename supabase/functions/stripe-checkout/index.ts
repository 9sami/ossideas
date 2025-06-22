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

  // For 204 No Content, don't include Content-Type or body
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
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return corsResponse({ error: 'Invalid JSON in request body' }, 400);
    }

    const { price_id, success_url, cancel_url } = requestBody;

    // Validate required parameters
    if (!price_id || typeof price_id !== 'string') {
      return corsResponse({ error: 'price_id is required and must be a string' }, 400);
    }

    if (!success_url || typeof success_url !== 'string') {
      return corsResponse({ error: 'success_url is required and must be a string' }, 400);
    }

    if (!cancel_url || typeof cancel_url !== 'string') {
      return corsResponse({ error: 'cancel_url is required and must be a string' }, 400);
    }

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return corsResponse({ error: 'Missing or invalid authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError) {
      console.error('Failed to authenticate user:', getUserError);
      return corsResponse({ error: 'Failed to authenticate user' }, 401);
    }

    if (!user) {
      return corsResponse({ error: 'User not found' }, 404);
    }

    console.log(`Processing checkout for user: ${user.id}, price: ${price_id}`);

    // Get or create Stripe customer
    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Failed to fetch customer information from the database:', getCustomerError);
      return corsResponse({ error: 'Failed to fetch customer information' }, 500);
    }

    let customerId;

    if (!customer || !customer.customer_id) {
      console.log(`Creating new Stripe customer for user: ${user.id}`);
      
      // Create new Stripe customer
      try {
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });

        console.log(`Created new Stripe customer ${newCustomer.id} for user ${user.id}`);

        // Save customer to database
        const { error: createCustomerError } = await supabase.from('stripe_customers').insert({
          user_id: user.id,
          customer_id: newCustomer.id,
        });

        if (createCustomerError) {
          console.error('Failed to save customer information in the database:', createCustomerError);
          
          // Clean up Stripe customer
          try {
            await stripe.customers.del(newCustomer.id);
          } catch (deleteError) {
            console.error('Failed to delete Stripe customer after database error:', deleteError);
          }

          return corsResponse({ error: 'Failed to create customer mapping' }, 500);
        }

        customerId = newCustomer.id;
      } catch (stripeError) {
        console.error('Failed to create Stripe customer:', stripeError);
        return corsResponse({ error: 'Failed to create Stripe customer' }, 500);
      }
    } else {
      customerId = customer.customer_id;
      console.log(`Using existing customer: ${customerId}`);
    }

    // Verify the price exists in Stripe
    try {
      await stripe.prices.retrieve(price_id);
    } catch (priceError) {
      console.error('Invalid price ID:', priceError);
      return corsResponse({ error: 'Invalid price ID' }, 400);
    }

    // Create Checkout Session for subscription
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

      console.log(`Created checkout session ${session.id} for customer ${customerId}`);

      return corsResponse({ 
        sessionId: session.id, 
        url: session.url 
      });

    } catch (sessionError) {
      console.error('Failed to create checkout session:', sessionError);
      return corsResponse({ 
        error: `Failed to create checkout session: ${sessionError instanceof Error ? sessionError.message : 'Unknown error'}` 
      }, 500);
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Checkout error: ${errorMessage}`);
    return corsResponse({ error: `Internal server error: ${errorMessage}` }, 500);
  }
});