import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const { getCurrentUser } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
  const handleAuthCallback = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (data.session?.user) {
        const user = data.session.user;
        
        // Update profile
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name || user.user_metadata.name || null,
          avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture || null,
          location: user.user_metadata.location || null,
        }, { onConflict: 'id' });

        // Wait for auth state to update
        await new Promise<void>((resolve) => {
          const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.id === user.id) {
              unsubscribe.subscription.unsubscribe();
              resolve();
            }
          });
        });
      }

      navigate('/');
    } catch (error) {
      console.error('Auth callback error:', error);
      navigate('/');
    }
  };

  handleAuthCallback();
}, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;