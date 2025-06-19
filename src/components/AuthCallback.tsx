import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const { getCurrentUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          window.location.href = '/';
          return;
        }

        if (data.session?.user) {
          // Extract user information from Google OAuth
          const user = data.session.user;
          const userMetadata = user.user_metadata;
          
          // Create or update profile with Google data
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email!,
              full_name: userMetadata.full_name || userMetadata.name || null,
              avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
              location: userMetadata.location || null,
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }

        // Redirect to home page
        window.location.href = '/';
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        window.location.href = '/';
      }
    };

    handleAuthCallback();
  }, [getCurrentUser]);

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