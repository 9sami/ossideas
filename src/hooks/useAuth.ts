import { useState, useEffect, createContext, useContext } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, AuthState, LoginCredentials, RegisterCredentials, AuthResponse, OnboardingData } from '../types/auth';

// Auth Context
const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  completeOnboarding: (data: OnboardingData) => Promise<{ success: boolean; error?: string }>;
  refreshUserData: () => Promise<void>;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom hook for auth logic
export const useAuthLogic = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    emailVerificationRequired: false,
    onboardingRequired: false,
  });

  // Check if user is onboarded based on database fields
  const checkIfOnboarded = async (user: User): Promise<boolean> => {
    if (!user) return true; // No user means no onboarding needed
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking onboarding status:', error);
        return false;
      }

      return profile?.onboarding_completed || false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };

  // Check if user exists with given email
  const checkUserExists = async (email: string): Promise<{ exists: boolean; provider?: string }> => {
    try {
      // Try to get user by email from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, auth_provider')
        .eq('email', email)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          return { exists: false };
        }
        console.error('Error checking profile existence:', profileError);
        return { exists: false };
      }

      if (profile) {
        // Check if the user still exists in auth system
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          // User exists in profiles but not in auth - clean up the stale profile
          await supabase
            .from('profiles')
            .delete()
            .eq('id', profile.id);
          return { exists: false };
        }

        return { 
          exists: true, 
          provider: profile.auth_provider || 'email'
        };
      }

      return { exists: false };
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { exists: false };
    }
  };

  // Convert Supabase user to our User type with retry mechanism
  const convertSupabaseUser = async (supabaseUser: SupabaseUser, retryCount = 0): Promise<User | null> => {
    const maxRetries = 3;
    const retryDelay = 1000;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116' && retryCount < maxRetries) {
          console.log(`Profile not found, retrying... (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return convertSupabaseUser(supabaseUser, retryCount + 1);
        }
        
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        location: profile.location,
        avatarUrl: profile.avatar_url,
        phoneNumber: profile.phone_number,
        usagePurpose: profile.usage_purpose,
        industries: profile.industries,
        referralSource: profile.referral_source,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    } catch (error) {
      if (retryCount < maxRetries) {
        console.log(`Error converting user, retrying... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return convertSupabaseUser(supabaseUser, retryCount + 1);
      }
      
      console.error('Error converting user:', error);
      return null;
    }
  };

  // Refresh user data function
  const refreshUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email_confirmed_at) {
        const updatedUser = await convertSupabaseUser(user);
        if (updatedUser) {
          const isOnboarded = await checkIfOnboarded(updatedUser);
          setAuthState(prev => ({ 
            ...prev, 
            user: updatedUser,
            onboardingRequired: !isOnboarded,
            error: null
          }));
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        // Get the initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event, newSession?.user?.id);
            
            if (!mounted) return;

            if (event === 'SIGNED_OUT') {
              setAuthState({
                user: null,
                loading: false,
                error: null,
                emailVerificationRequired: false,
                onboardingRequired: false,
              });
              return;
            }

            try {
              if (newSession?.user) {
                if (!newSession.user.email_confirmed_at) {
                  setAuthState({ 
                    user: null, 
                    loading: false, 
                    error: null, 
                    emailVerificationRequired: true,
                    onboardingRequired: false,
                  });
                  return;
                }

                const user = await convertSupabaseUser(newSession.user);
                if (!user) {
                  throw new Error('Failed to get user data');
                }

                const isOnboarded = await checkIfOnboarded(user);
                
                if (mounted) {
                  setAuthState({ 
                    user, 
                    loading: false, 
                    error: null, 
                    emailVerificationRequired: false,
                    onboardingRequired: !isOnboarded,
                  });
                }
              } else {
                if (mounted) {
                  setAuthState({
                    user: null,
                    loading: false,
                    error: null,
                    emailVerificationRequired: false,
                    onboardingRequired: false,
                  });
                }
              }
            } catch (error) {
              console.error('Error processing auth change:', error);
              if (mounted) {
                setAuthState(prev => ({ 
                  ...prev, 
                  loading: false,
                  error: error instanceof Error ? error.message : 'Authentication error'
                }));
              }
            }
          }
        );

        authSubscription = subscription;

        // Process initial session
        if (session?.user) {
          const user = await convertSupabaseUser(session.user);
          if (user) {
            const isOnboarded = await checkIfOnboarded(user);
            if (mounted) {
              setAuthState({
                user,
                loading: false,
                error: null,
                emailVerificationRequired: false,
                onboardingRequired: !isOnboarded,
              });
            }
          }
        } else {
          if (mounted) {
            setAuthState({
              user: null,
              loading: false,
              error: null,
              emailVerificationRequired: false,
              onboardingRequired: false,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setAuthState({
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to initialize auth',
            emailVerificationRequired: false,
            onboardingRequired: false,
          });
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Login with email and password
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null, 
        emailVerificationRequired: false,
        onboardingRequired: false,
      }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null, 
            emailVerificationRequired: true,
            onboardingRequired: false,
          });
          return { 
            user: null, 
            error: null, 
            emailVerificationRequired: true 
          };
        }
        
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage,
          emailVerificationRequired: false,
          onboardingRequired: false,
        }));
        return { user: null, error: errorMessage };
      }

      if (data.user) {
        if (!data.user.email_confirmed_at) {
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null, 
            emailVerificationRequired: true,
            onboardingRequired: false,
          });
          return { 
            user: null, 
            error: null, 
            emailVerificationRequired: true 
          };
        }

        const user = await convertSupabaseUser(data.user);
        const isOnboarded = user ? checkIfOnboarded(user) : true;
        
        setAuthState({ 
          user, 
          loading: false, 
          error: null, 
          emailVerificationRequired: false,
          onboardingRequired: !isOnboarded,
        });
        
        return { 
          user, 
          error: null, 
          onboardingRequired: !isOnboarded 
        };
      }

      return { user: null, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        emailVerificationRequired: false,
        onboardingRequired: false,
      }));
      return { user: null, error: errorMessage };
    }
  };

  // Register with email and password
  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null, 
        emailVerificationRequired: false,
        onboardingRequired: false,
      }));

      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        const errorMessage = 'Passwords do not match';
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage,
          emailVerificationRequired: false,
          onboardingRequired: false,
        }));
        return { user: null, error: errorMessage };
      }

      // Check if user already exists
      const userCheck = await checkUserExists(credentials.email);
      
      if (userCheck.exists) {
        const errorMessage = userCheck.provider === 'oauth' 
          ? `An account with ${credentials.email} already exists. Please sign in with Google or use the "Forgot Password" option if you created this account with a password.`
          : `An account with ${credentials.email} already exists. Please sign in instead or use "Forgot Password" if you've forgotten your credentials.`;
        
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage,
          emailVerificationRequired: false,
          onboardingRequired: false,
        }));
        return { user: null, error: errorMessage };
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName || null,
          },
        },
      });

      if (error) {
        let errorMessage = error.message;
        
        if (error.message.includes('User already registered')) {
          errorMessage = `An account with ${credentials.email} already exists. Please sign in instead.`;
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Unable to validate email address')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage,
          emailVerificationRequired: false,
          onboardingRequired: false,
        }));
        return { user: null, error: errorMessage };
      }

      if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null, 
            emailVerificationRequired: true,
            onboardingRequired: false,
          });
          return { 
            user: null, 
            error: null, 
            emailVerificationRequired: true 
          };
        }

        // Email is already confirmed, user will need onboarding
        const user = await convertSupabaseUser(data.user);
        const isOnboarded = user ? checkIfOnboarded(user) : false;
        
        setAuthState({ 
          user, 
          loading: false, 
          error: null, 
          emailVerificationRequired: false,
          onboardingRequired: !isOnboarded,
        });
        
        return { 
          user, 
          error: null, 
          onboardingRequired: !isOnboarded 
        };
      }

      return { user: null, error: 'Registration failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        emailVerificationRequired: false,
        onboardingRequired: false,
      }));
      return { user: null, error: errorMessage };
    }
  };

  // Complete onboarding
  const completeOnboarding = async (data: OnboardingData): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          phone_number: data.phoneNumber,
          location: data.location,
          usage_purpose: data.usagePurpose,
          industries: data.industries,
          referral_source: data.referralSource,
          updated_at: new Date().toISOString(),
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refresh user data
      const updatedUser = await convertSupabaseUser(user);
      
      if (!updatedUser) {
        throw new Error('Failed to refresh user data');
      }

      setAuthState(prev => ({ 
        ...prev, 
        user: updatedUser, 
        loading: false, 
        error: null,
        onboardingRequired: false,
        emailVerificationRequired: false
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to authenticate with Google'
        }));
        return;
      }

      if (!data.url) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to get OAuth URL'
        }));
        return;
      }

      // Redirect to the OAuth URL
      window.location.href = data.url;
    } catch (error) {
      console.error('Google OAuth error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'An unexpected error occurred during Google authentication'
      }));
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null, 
        emailVerificationRequired: false,
        onboardingRequired: false,
      }));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        emailVerificationRequired: false,
        onboardingRequired: false,
      }));
      throw new Error(errorMessage);
    }
  };

  // Get current user
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email_confirmed_at) {
        return await convertSupabaseUser(user);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  return {
    authState,
    login,
    register,
    loginWithGoogle,
    logout,
    getCurrentUser,
    completeOnboarding,
    refreshUserData,
  };
};

export { AuthContext };