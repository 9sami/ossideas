import { useState, useEffect, createContext, useContext } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

// Auth Context
const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
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
  });

  // Check if user exists with given email
  const checkUserExists = async (email: string): Promise<{ exists: boolean; provider?: string }> => {
    try {
      // First check if there's an existing user by attempting to sign in with a dummy password
      // This is a safe way to check if an email is registered without exposing user data
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password-for-checking-existence'
      });

      if (error) {
        // If error is "Invalid login credentials", the email exists but password is wrong
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('invalid_credentials')) {
          // Try to determine the provider by checking common OAuth patterns
          // This is a heuristic approach since Supabase doesn't expose provider info directly
          return { exists: true, provider: 'email' };
        }
        
        // If error is about email not confirmed, user exists but needs verification
        if (error.message.includes('email not confirmed') || 
            error.message.includes('Email not confirmed')) {
          return { exists: true, provider: 'email' };
        }
        
        // If error is "User not found" or similar, email doesn't exist
        if (error.message.includes('User not found') || 
            error.message.includes('user_not_found')) {
          return { exists: false };
        }
      }

      // If no error (which shouldn't happen with dummy password), assume exists
      return { exists: true, provider: 'email' };
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { exists: false };
    }
  };

  // Convert Supabase user to our User type with retry mechanism
  const convertSupabaseUser = async (supabaseUser: SupabaseUser, retryCount = 0): Promise<User | null> => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        // If profile not found and we haven't exceeded retry limit, retry
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
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    } catch (error) {
      // If it's a network error or similar, retry
      if (retryCount < maxRetries) {
        console.log(`Error converting user, retrying... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return convertSupabaseUser(supabaseUser, retryCount + 1);
      }
      
      console.error('Error converting user:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if email is confirmed
          if (!session.user.email_confirmed_at) {
            setAuthState({ 
              user: null, 
              loading: false, 
              error: null, 
              emailVerificationRequired: true 
            });
            return;
          }

          const user = await convertSupabaseUser(session.user);
          setAuthState({ 
            user, 
            loading: false, 
            error: null, 
            emailVerificationRequired: false 
          });
        } else {
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null, 
            emailVerificationRequired: false 
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({ 
          user: null, 
          loading: false, 
          error: 'Failed to initialize authentication',
          emailVerificationRequired: false 
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          // Check if email is confirmed
          if (!session.user.email_confirmed_at) {
            setAuthState({ 
              user: null, 
              loading: false, 
              error: null, 
              emailVerificationRequired: true 
            });
            return;
          }

          // Set loading state while we fetch the profile
          setAuthState(prev => ({ ...prev, loading: true, emailVerificationRequired: false }));
          
          const user = await convertSupabaseUser(session.user);
          setAuthState({ 
            user, 
            loading: false, 
            error: null, 
            emailVerificationRequired: false 
          });
        } else {
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null, 
            emailVerificationRequired: false 
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Login with email and password
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null, 
        emailVerificationRequired: false 
      }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null, 
            emailVerificationRequired: true 
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
          emailVerificationRequired: false 
        }));
        return { user: null, error: errorMessage };
      }

      if (data.user) {
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null, 
            emailVerificationRequired: true 
          });
          return { 
            user: null, 
            error: null, 
            emailVerificationRequired: true 
          };
        }

        const user = await convertSupabaseUser(data.user);
        setAuthState({ 
          user, 
          loading: false, 
          error: null, 
          emailVerificationRequired: false 
        });
        return { user, error: null };
      }

      return { user: null, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        emailVerificationRequired: false 
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
        emailVerificationRequired: false 
      }));

      // First check if user already exists
      const userCheck = await checkUserExists(credentials.email);
      
      if (userCheck.exists) {
        const errorMessage = userCheck.provider === 'oauth' 
          ? `An account with ${credentials.email} already exists. Please sign in with Google or use the "Forgot Password" option if you created this account with a password.`
          : `An account with ${credentials.email} already exists. Please sign in instead or use "Forgot Password" if you've forgotten your credentials.`;
        
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage,
          emailVerificationRequired: false 
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
        
        // Handle specific Supabase errors with user-friendly messages
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
          emailVerificationRequired: false 
        }));
        return { user: null, error: errorMessage };
      }

      if (data.user) {
        // Check if email confirmation is required (session will be null if confirmation is needed)
        if (!data.session) {
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null, 
            emailVerificationRequired: true 
          });
          return { 
            user: null, 
            error: null, 
            emailVerificationRequired: true 
          };
        }

        // Email is already confirmed (e.g., via OAuth or disabled confirmation)
        const user = await convertSupabaseUser(data.user);
        setAuthState({ 
          user, 
          loading: false, 
          error: null, 
          emailVerificationRequired: false 
        });
        return { user, error: null };
      }

      return { user: null, error: 'Registration failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        emailVerificationRequired: false 
      }));
      return { user: null, error: errorMessage };
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null, 
        emailVerificationRequired: false 
      }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message,
          emailVerificationRequired: false 
        }));
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        emailVerificationRequired: false 
      }));
      throw new Error(errorMessage);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      // Set loading state to provide immediate feedback
      setAuthState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null, 
        emailVerificationRequired: false 
      }));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Don't manually set auth state - let onAuthStateChange handle it
      // This ensures consistency with Supabase's session management
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        emailVerificationRequired: false 
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
  };
};

export { AuthContext };