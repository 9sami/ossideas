import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface SubscriptionManagementResult {
  success: boolean;
  message?: string;
  error?: string;
}

export const useSubscriptionManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSubscription = async (subscriptionId: string, newPriceId: string): Promise<SubscriptionManagementResult> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Updating subscription:', subscriptionId, 'to price:', newPriceId);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-subscription-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'update_subscription',
          subscription_id: subscriptionId,
          price_id: newPriceId,
        }),
      });

      console.log('Update subscription response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update subscription error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Update subscription result:', result);

      return {
        success: true,
        message: result.message || 'Subscription updated successfully'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subscription';
      console.error('Update subscription error:', errorMessage);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string): Promise<SubscriptionManagementResult> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Canceling subscription:', subscriptionId);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-subscription-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'cancel_subscription',
          subscription_id: subscriptionId,
        }),
      });

      console.log('Cancel subscription response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cancel subscription error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Cancel subscription result:', result);

      return {
        success: true,
        message: result.message || 'Subscription canceled successfully'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel subscription';
      console.error('Cancel subscription error:', errorMessage);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const reactivateSubscription = async (subscriptionId: string): Promise<SubscriptionManagementResult> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Reactivating subscription:', subscriptionId);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-subscription-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'reactivate_subscription',
          subscription_id: subscriptionId,
        }),
      });

      console.log('Reactivate subscription response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Reactivate subscription error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Reactivate subscription result:', result);

      return {
        success: true,
        message: result.message || 'Subscription reactivated successfully'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reactivate subscription';
      console.error('Reactivate subscription error:', errorMessage);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateSubscription,
    cancelSubscription,
    reactivateSubscription,
    loading,
    error,
  };
};