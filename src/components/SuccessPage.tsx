import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, Crown, Calendar, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SubscriptionData {
  id: string;
  plan_name: string;
  plan_interval: string;
  amount_cents: number;
  currency: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  payment_method_brand?: string;
  payment_method_last4?: string;
  created_at: string;
}

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Wait a moment for webhook to process, then check for subscription data
      setTimeout(async () => {
        try {
          // First, try to get the most recent subscription for this user
          const { data: subscriptions, error: subscriptionsError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1);

          if (subscriptionsError) {
            console.error('Error fetching subscription:', subscriptionsError);
            setError('Unable to verify your subscription. Your payment was processed successfully.');
          } else if (subscriptions && subscriptions.length > 0) {
            setSubscriptionData(subscriptions[0]);
          } else {
            // No active subscription found, but payment might still be processing
            setError('Your payment is being processed. You should receive a confirmation email shortly and your subscription will be activated.');
          }
        } catch (err) {
          console.error('Error verifying subscription:', err);
          setError('Unable to verify your subscription. Please contact support if you don\'t see your subscription activated shortly.');
        } finally {
          setLoading(false);
        }
      }, 2000);
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  const handleContinue = () => {
    navigate('/');
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100); // Convert from cents
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'pro':
        return Crown;
      case 'basic':
        return Sparkles;
      default:
        return Sparkles;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'pro':
        return 'from-orange-500 to-orange-600';
      case 'basic':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700">Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-yellow-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error}
          </p>

          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-xs text-gray-500 mt-6">
            If you have any questions, contact us at{' '}
            <a href="mailto:support@ossideas.com" className="text-yellow-600 hover:text-yellow-700">
              support@ossideas.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  const PlanIcon = subscriptionData ? getPlanIcon(subscriptionData.plan_name) : Sparkles;
  const planGradient = subscriptionData ? getPlanColor(subscriptionData.plan_name) : 'from-green-500 to-green-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Subscription Activated!
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Welcome to OSSIdeas! Your subscription has been activated successfully and you now have access to all premium features.
        </p>

        {/* Subscription Details */}
        {subscriptionData && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${planGradient} rounded-lg flex items-center justify-center`}>
                <PlanIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {subscriptionData.plan_name} Plan
                </h3>
                <p className="text-sm text-gray-600">
                  {formatAmount(subscriptionData.amount_cents, subscriptionData.currency)} per {subscriptionData.plan_interval}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>Next billing: {formatDate(subscriptionData.current_period_end)}</span>
              </div>
              
              {subscriptionData.payment_method_brand && subscriptionData.payment_method_last4 && (
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span>
                    {subscriptionData.payment_method_brand.toUpperCase()} ending in {subscriptionData.payment_method_last4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-3 text-center">What's next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Access all premium startup ideas and features</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Export ideas to Notion, PDF, and other formats</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Get weekly trending reports and insights</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Join our exclusive community of entrepreneurs</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Start Exploring Ideas</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Support */}
        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact us at{' '}
          <a href="mailto:support@ossideas.com" className="text-green-600 hover:text-green-700">
            support@ossideas.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;