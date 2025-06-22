import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Building2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { StripeProduct, getSubscriptionProducts } from '../stripe-config';

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
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const { authState } = useAuth();

  useEffect(() => {
    if (authState.user) {
      fetchUserSubscription();
    }
  }, [authState.user]);

  const fetchUserSubscription = async () => {
    try {
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
    }
  };

  // Get subscription products based on billing period
  const subscriptionProducts = getSubscriptionProducts();
  const currentPeriodProducts = subscriptionProducts.filter(product => 
    product.interval === (isAnnual ? 'year' : 'month')
  );

  // Create plans from Stripe products
  const plans: PricingPlan[] = [
    // Basic Plan
    ...currentPeriodProducts
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
        buttonText: `Start ${product.name} Plan`,
        gradient: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      })),
    
    // Pro Plan
    ...currentPeriodProducts
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
        buttonText: `Start ${product.name} Plan`,
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
      buttonText: "Let's have a call",
      gradient: 'from-gray-500 to-gray-600',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

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

    setLoadingPlan(plan.id);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: plan.stripeProduct.priceId,
          mode: 'subscription',
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert(`Failed to start checkout: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const getMonthlyPrice = (plan: PricingPlan) => {
    if (plan.period === 'year') {
      return plan.price / 12;
    }
    return plan.price;
  };

  const getAnnualSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12;
    return monthlyTotal - yearlyPrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
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
          {authState.user && userSubscription && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Current Plan: {userSubscription.status || 'Active'}
                </span>
              </div>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const monthlyPrice = getMonthlyPrice(plan);
            const currency = plan.stripeProduct?.currency || 'USD';
            
            // Calculate savings for annual plans
            const monthlyPlan = plans.find(p => p.name === plan.name && p.period === 'month');
            const annualSavings = monthlyPlan && plan.period === 'year' 
              ? getAnnualSavings(monthlyPlan.price, plan.price)
              : 0;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular 
                    ? 'border-orange-200 ring-4 ring-orange-100' 
                    : 'border-gray-200 hover:border-orange-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
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
                        
                        {plan.period === 'year' && (
                          <div className="text-sm text-gray-500">
                            <div className="text-green-600 font-medium">
                              Save {formatPrice(annualSavings, currency)} per year
                            </div>
                            <div className="text-xs">
                              {formatPrice(monthlyPrice, currency)}/month when billed annually
                            </div>
                          </div>
                        )}
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
                    disabled={loadingPlan === plan.id}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                      plan.popular
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
                        <ArrowRight className="h-4 w-4" />
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