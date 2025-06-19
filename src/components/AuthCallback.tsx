import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

const AuthCallback: React.FC = () => {
  const { getCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/');
          return;
        }

        if (data.session?.user) {
          // Extract user information from Google OAuth
          const user = data.session.user;
          const userMetadata = user.user_metadata;
          
          // First, check if profile exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          // Create or update profile with Google data
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email!,
              full_name: userMetadata.full_name || userMetadata.name || null,
              avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
              location: userMetadata.location || null,
              // Only set these fields if profile doesn't exist
              ...(existingProfile ? {} : {
                phone_number: null,
                usage_purpose: null,
                industries: [],
                referral_source: null,
                created_at: new Date().toISOString(),
              }),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }

          // Wait a moment to ensure the profile is created
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if onboarding is needed
          const currentUser = await getCurrentUser();
          const needsOnboarding = !currentUser?.usagePurpose;
          
          // Redirect to home page with onboarding state if needed
          navigate('/', { 
            state: { 
              showOnboarding: needsOnboarding,
              justLoggedIn: true
            },
            replace: true // Use replace to prevent back button from returning to callback
          });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [getCurrentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Completing authentication..." />
    </div>
  );
};

export default AuthCallback;