import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Wait a moment for webhook to process, then check for order data
      setTimeout(async () => {
        try {
          const { data: orders, error: ordersError } = await supabase
            .from('stripe_user_orders')
            .select('*')
            .eq('checkout_session_id', sessionId)
            .maybeSingle();

          if (ordersError) {
            console.error('Error fetching order:', ordersError);
            setError('Unable to verify your purchase. Please contact support.');
          } else if (orders) {
            setOrderData(orders);
          } else {
            // Order might still be processing
            setError('Your payment is being processed. You should receive a confirmation email shortly.');
          }
        } catch (err) {
          console.error('Error verifying purchase:', err);
          setError('Unable to verify your purchase. Please contact support.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700">Confirming your purchase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-yellow-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Processing
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thank you for your purchase! Your payment has been processed successfully and you should receive a confirmation email shortly.
        </p>

        {/* Order Details */}
        {orderData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">
                Order Confirmed
              </span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>Amount: {formatAmount(orderData.amount_total, orderData.currency)}</p>
              <p>Order ID: {orderData.order_id}</p>
              <p>Status: {orderData.order_status}</p>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">What's next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Check your email for the receipt and confirmation</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Access your purchased content in your dashboard</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Explore our premium features and content</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Contact support if you have any questions</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Continue to Dashboard</span>
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