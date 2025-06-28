import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'OSSIdeas Subscription Management',
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
      return corsResponse({}, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    const { action, price_id, subscription_id } = await req.json();

    // Validate required parameters
    if (!action) {
      return corsResponse({ error: 'Action is required' }, 400);
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError || !user) {
      return corsResponse({ error: 'Failed to authenticate user' }, 401);
    }

    console.log(`Processing ${action} for user ${user.id}`);

    switch (action) {
      case 'update_subscription':
        return await handleUpdateSubscription(
          user.id,
          subscription_id,
          price_id,
        );

      case 'cancel_subscription':
        return await handleCancelSubscription(user.id, subscription_id);

      case 'reactivate_subscription':
        return await handleReactivateSubscription(user.id, subscription_id);

      default:
        return corsResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Subscription management error: ${errorMessage}`);
    return corsResponse({ error: errorMessage }, 500);
  }
});

async function handleUpdateSubscription(
  userId: string,
  subscriptionId: string,
  newPriceId: string,
) {
  try {
    if (!subscriptionId || !newPriceId) {
      return corsResponse(
        { error: 'Subscription ID and new price ID are required' },
        400,
      );
    }

    // Verify the user owns this subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, stripe_price_id, plan_name')
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (subError || !subscription) {
      return corsResponse(
        { error: 'Subscription not found or access denied' },
        404,
      );
    }

    // Check if the price is actually different
    if (subscription.stripe_price_id === newPriceId) {
      return corsResponse(
        { error: 'Subscription is already on this plan' },
        400,
      );
    }

    console.log(
      `Updating subscription ${subscriptionId} from ${subscription.stripe_price_id} to ${newPriceId}`,
    );

    // Get the current subscription from Stripe with expanded items
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscriptionId,
      {
        expand: ['items.data.price'],
      },
    );

    if (!stripeSubscription) {
      return corsResponse({ error: 'Subscription not found in Stripe' }, 404);
    }

    if (
      !stripeSubscription.items.data ||
      stripeSubscription.items.data.length === 0
    ) {
      return corsResponse({ error: 'No subscription items found' }, 400);
    }

    // Get the current subscription item
    const currentItem = stripeSubscription.items.data[0];

    console.log(
      `Current subscription item: ${currentItem.id}, price: ${currentItem.price.id}`,
    );
    console.log(`Updating to new price: ${newPriceId}`);

    // Update the subscription using the correct Stripe API method
    // This is the proper way according to Stripe docs
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: currentItem.id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations', // This will prorate the charges
        expand: ['latest_invoice', 'items.data.price'],
      },
    );

    console.log(
      `Successfully updated subscription ${subscriptionId} in Stripe`,
    );
    console.log(`New subscription status: ${updatedSubscription.status}`);
    console.log(`New price ID: ${updatedSubscription.items.data[0].price.id}`);

    // Manually update the database as a fallback in case webhook doesn't trigger
    try {
      console.log('Manually updating database as webhook fallback...');

      // Get the new price details from Stripe
      const priceDetails = await stripe.prices.retrieve(newPriceId, {
        expand: ['product'],
      });

      // Determine plan name and interval from price
      let planName = 'Basic';
      let planInterval = 'month';

      if (priceDetails.metadata?.plan_name) {
        planName = priceDetails.metadata.plan_name;
      } else if (priceDetails.unit_amount && priceDetails.unit_amount >= 2000) {
        planName = 'Pro';
      }

      if (priceDetails.recurring?.interval) {
        planInterval = priceDetails.recurring.interval;
      }

      console.log(
        `Updating database with plan: ${planName}, interval: ${planInterval}`,
      );

      // Update the subscription in our database
      const { error: dbUpdateError } = await supabase
        .from('subscriptions')
        .update({
          stripe_price_id: newPriceId,
          plan_name: planName,
          plan_interval: planInterval,
          amount_cents: priceDetails.unit_amount || 0,
          currency: priceDetails.currency || 'usd',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId);

      if (dbUpdateError) {
        console.error('Error updating database:', dbUpdateError);
        // Don't fail the request, just log the error
      } else {
        console.log('Database updated successfully as fallback');
      }
    } catch (fallbackError) {
      console.error('Error in database fallback update:', fallbackError);
      // Don't fail the request, just log the error
    }

    // The webhook will handle updating our database, but let's also return the updated info
    return corsResponse({
      success: true,
      subscription_id: updatedSubscription.id,
      new_price_id: updatedSubscription.items.data[0].price.id,
      status: updatedSubscription.status,
      current_period_end: updatedSubscription.current_period_end,
      message:
        'Subscription updated successfully. Changes will be reflected shortly.',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error updating subscription: ${errorMessage}`);

    // Log more details for debugging
    if (error instanceof Error && 'type' in error) {
      console.error(`Stripe error type: ${(error as any).type}`);
      console.error(`Stripe error code: ${(error as any).code}`);
    }

    return corsResponse(
      { error: `Failed to update subscription: ${errorMessage}` },
      500,
    );
  }
}

async function handleCancelSubscription(
  userId: string,
  subscriptionId: string,
) {
  try {
    if (!subscriptionId) {
      return corsResponse({ error: 'Subscription ID is required' }, 400);
    }

    // Verify the user owns this subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, plan_name')
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (subError || !subscription) {
      return corsResponse(
        { error: 'Subscription not found or access denied' },
        404,
      );
    }

    console.log(`Canceling subscription ${subscriptionId} for user ${userId}`);

    // Cancel the subscription in Stripe (at period end)
    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    console.log(
      `Successfully canceled subscription ${subscriptionId} in Stripe`,
    );

    return corsResponse({
      success: true,
      subscription_id: canceledSubscription.id,
      cancel_at_period_end: canceledSubscription.cancel_at_period_end,
      current_period_end: canceledSubscription.current_period_end,
      message:
        'Subscription will be canceled at the end of the current billing period.',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error canceling subscription: ${errorMessage}`);
    return corsResponse(
      { error: `Failed to cancel subscription: ${errorMessage}` },
      500,
    );
  }
}

async function handleReactivateSubscription(
  userId: string,
  subscriptionId: string,
) {
  try {
    if (!subscriptionId) {
      return corsResponse({ error: 'Subscription ID is required' }, 400);
    }

    // Verify the user owns this subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, plan_name, cancel_at_period_end')
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (subError || !subscription) {
      return corsResponse(
        { error: 'Subscription not found or access denied' },
        404,
      );
    }

    if (!subscription.cancel_at_period_end) {
      return corsResponse(
        { error: 'Subscription is not scheduled for cancellation' },
        400,
      );
    }

    console.log(
      `Reactivating subscription ${subscriptionId} for user ${userId}`,
    );

    // Reactivate the subscription in Stripe
    const reactivatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: false,
      },
    );

    console.log(
      `Successfully reactivated subscription ${subscriptionId} in Stripe`,
    );

    return corsResponse({
      success: true,
      subscription_id: reactivatedSubscription.id,
      cancel_at_period_end: reactivatedSubscription.cancel_at_period_end,
      message: 'Subscription has been reactivated successfully.',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error reactivating subscription: ${errorMessage}`);
    return corsResponse(
      { error: `Failed to reactivate subscription: ${errorMessage}` },
      500,
    );
  }
}
