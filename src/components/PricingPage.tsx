import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Building2, ArrowRight, Sparkles, AlertCircle, Calendar, CreditCard, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { StripeProduct, getSubscriptionProducts, validateStripeConfig } from '../stripe-config';

interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  plan_name: string;
  plan_interval: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_method_brand: string;
  payment_method_last4: string;
  amount_cents: number;
  currency: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  days_until_renewal: number;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  popular?: boolean;
  enterprise?: boolean;
  stripeProduct?: StripeProduct;
  buttonText: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

const PricingPage: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { authState } = useAuth();

  useEffect(() => {
    // Validate Stripe configuration
    const validation = validateStripeConfig();
    if (!validation.isValid) {
      setConfigError(validation.errors.join(', '));
    }

    if (authState.user) {
      fetchUserSubscription();
    } else {
      setSubscriptionLoading(false);
    }
  }, [authState.user]);

  const fetchUserSubscription = async () => {
    try {
      setSubscriptionLoading(true);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', authState.user?.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setUserSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Get subscription products
  const subscriptionProducts = getSubscriptionProducts();

  // Create plans from Stripe products
  const plans: PricingPlan[] = [
    // Basic Plan
    ...subscriptionProducts
      .filter(product => product.name === 'Basic')
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price / 100, // Convert from cents
        period: product.interval || 'month',
        description: product.description,
        features: product.features,
        icon: Zap,
        stripeProduct: product,
        buttonText: getButtonText(product, userSubscription),
        gradient: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      })),
    
    // Pro Plan
    ...subscriptionProducts
      .filter(product => product.name === 'Pro')
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price / 100, // Convert from cents
        period: product.interval || 'month',
        description: product.description,
        features: product.features,
        icon: Crown,
        popular: product.popular,
        stripeProduct: product,
        buttonText: getButtonText(product, userSubscription),
        gradient: 'from-orange-500 to-orange-600',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      })),
    
    // Enterprise Plan (custom)
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 0,
      period: 'custom',
      description: 'Tailored solutions for large organizations and teams',
      features: [
        'Unlimited access to all startup ideas',
        'Custom idea generation based on your industry',
        'Dedicated account manager',
        'White-label solutions',
        'API access for integrations',
        'Custom reporting and analytics',
        'Team collaboration tools',
        'Priority phone support',
        'Custom training and onboarding'
      ],
      icon: Building2,
      enterprise: true,
      buttonText: "Contact Sales",
      gradient: 'from-gray-500 to-gray-600',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  function getButtonText(product: StripeProduct, subscription: UserSubscription | null): string {
    if (!subscription) {
      return `Start ${product.name} Plan`;
    }

    // Check if this is the current plan
    if (subscription.plan_name === product.name && subscription.plan_interval === product.interval) {
      if (subscription.cancel_at_period_end) {
        return 'Reactivate Plan';
      }
      return 'Current Plan';
    }

    // Check if it's an upgrade or downgrade
    const currentPlanValue = getPlanValue(subscription.plan_name);
    const targetPlanValue = getPlanValue(product.name);

    if (targetPlanValue > currentPlanValue) {
      return `Upgrade to ${product.name}`;
    } else if (targetPlanValue < currentPlanValue) {
      return `Downgrade to ${product.name}`;
    } else {
      // Same plan, different interval
      return `Switch to ${product.interval}ly`;
    }
  }

  function getPlanValue(planName: string): number {
    switch (planName.toLowerCase()) {
      case 'basic': return 1;
      case 'pro': return 2;
      case 'enterprise': return 3;
      default: return 0;
    }
  }

  function isCurrentPlan(plan: PricingPlan): boolean {
    if (!userSubscription) return false;
    return userSubscription.plan_name === plan.name && 
           userSubscription.plan_interval === plan.period;
  }

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.enterprise) {
      // Handle enterprise contact
      window.open('mailto:enterprise@ossideas.com?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }

    if (!authState.user) {
      // Show login modal or redirect to login
      alert('Please sign in to purchase a plan');
      return;
    }

    if (!plan.stripeProduct) {
      alert('This plan is not available for purchase yet');
      return;
    }

    // If this is the current plan and not canceled, don't allow resubscription
    if (isCurrentPlan(plan) && !userSubscription?.cancel_at_period_end) {
      return;
    }

    setLoadingPlan(plan.id);
    setCheckoutError(null);

    try {
      console.log('Starting checkout for plan:', plan.name, 'Price ID:', plan.stripeProduct.priceId);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      const requestBody = {
        price_id: plan.stripeProduct.priceId,
        mode: 'subscription',
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/pricing`,
      };

      console.log('Sending checkout request:', requestBody);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Checkout response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout response error:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Checkout result:', result);

      if (result.url) {
        console.log('Redirecting to checkout:', result.url);
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setCheckoutError(`Failed to start checkout: ${errorMessage}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'trialing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'canceled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (subscription: UserSubscription) => {
    if (subscription.cancel_at_period_end) {
      return `Cancels on ${formatDate(subscription.current_period_end)}`;
    }
    
    switch (subscription.status) {
      case 'active':
        return `Renews on ${formatDate(subscription.current_period_end)}`;
      case 'trialing':
        return `Trial ends on ${formatDate(subscription.current_period_end)}`;
      case 'past_due':
        return 'Payment past due';
      case 'canceled':
        return 'Subscription canceled';
      default:
        return subscription.status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Configuration Error Alert */}
        {configError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Stripe Configuration Required</h3>
                <p className="text-sm text-red-700 mt-1">
                  Please update your Stripe price IDs in the configuration file: {configError}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Go to your Stripe Dashboard → Products → Create prices, then update src/stripe-config.ts with the real price IDs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Error Alert */}
        {checkoutError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Checkout Error</h3>
                <p className="text-sm text-red-700 mt-1">{checkoutError}</p>
              </div>
              <button
                onClick={() => setCheckoutError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Choose Your Perfect Plan
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Pricing</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start your entrepreneurial journey with the right plan for your needs. 
            All plans include our core features with no hidden fees.
          </p>

          {/* Current Subscription Status */}
          {authState.user && !subscriptionLoading && userSubscription && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {userSubscription.plan_name} Plan
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(userSubscription.status)}`}>
                        {userSubscription.status === 'active' ? 'Active' : userSubscription.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatPrice(userSubscription.amount_cents / 100, userSubscription.currency)} per {userSubscription.plan_interval}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {getStatusText(userSubscription)}
                    </div>
                    {userSubscription.payment_method_brand && userSubscription.payment_method_last4 && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {userSubscription.payment_method_brand.toUpperCase()} ending in {userSubscription.payment_method_last4}
                      </div>
                    )}
                  </div>
                </div>
                {userSubscription.cancel_at_period_end && (
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Ending Soon
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {authState.user && subscriptionLoading && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                <span className="text-gray-600">Loading subscription...</span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currency = plan.stripeProduct?.currency || 'USD';
            const isCurrentUserPlan = isCurrentPlan(plan);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  isCurrentUserPlan
                    ? 'border-orange-200 ring-4 ring-orange-100'
                    : plan.popular 
                    ? 'border-orange-200 ring-4 ring-orange-100' 
                    : 'border-gray-200 hover:border-orange-200'
                }`}
              >
                {/* Current Plan Badge */}
                {isCurrentUserPlan && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Current Plan
                    </div>
                  </div>
                )}

                {/* Popular Badge */}
                {plan.popular && !isCurrentUserPlan && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${plan.iconBg} rounded-2xl mb-4`}>
                      <Icon className={`h-8 w-8 ${plan.iconColor}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    {plan.enterprise ? (
                      <div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">Custom</div>
                        <div className="text-gray-500">Tailored to your needs</div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-4xl font-bold text-gray-900">
                            {formatPrice(plan.price, currency)}
                          </span>
                          {plan.period !== 'one-time' && (
                            <span className="text-gray-500 ml-2">/{plan.period}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loadingPlan === plan.id || (isCurrentUserPlan && !userSubscription?.cancel_at_period_end)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isCurrentUserPlan && !userSubscription?.cancel_at_period_end
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : plan.popular || isCurrentUserPlan
                        ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`
                        : plan.enterprise
                        ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg hover:scale-105`
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{plan.buttonText}</span>
                        {!(isCurrentUserPlan && !userSubscription?.cancel_at_period_end) && (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards through Stripe's secure payment processing."
              },
              {
                question: "Is there a free trial?",
                answer: "We offer a 7-day free trial for all paid plans. No credit card required to start your trial."
              },
              {
                question: "What happens if I cancel?",
                answer: "You can cancel anytime. You'll continue to have access to your plan features until the end of your billing period."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all subscription plans. One-time purchases are final but we're happy to help with any issues."
              },
              {
                question: "Can I get an invoice for my purchase?",
                answer: "Yes! You'll automatically receive an invoice via email after each payment. You can also download invoices from your account dashboard."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;