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
  });

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
          const user = await convertSupabaseUser(session.user);
          setAuthState({ user, loading: false, error: null });
        } else {
          setAuthState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({ user: null, loading: false, error: 'Failed to initialize authentication' });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          // Set loading state while we fetch the profile
          setAuthState(prev => ({ ...prev, loading: true }));
          
          const user = await convertSupabaseUser(session.user);
          setAuthState({ user, loading: false, error: null });
        } else {
          setAuthState({ user: null, loading: false, error: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Login with email and password
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        return { user: null, error: error.message };
      }

      if (data.user) {
        const user = await convertSupabaseUser(data.user);
        setAuthState({ user, loading: false, error: null });
        return { user, error: null };
      }

      return { user: null, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { user: null, error: errorMessage };
    }
  };

  // Register with email and password
  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

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
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: credentials.fullName || null,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        const user = await convertSupabaseUser(data.user);
        setAuthState({ user, loading: false, error: null });
        return { user, error: null };
      }

      return { user: null, error: 'Registration failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { user: null, error: errorMessage };
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

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
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuthState({ user: null, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Get current user
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
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