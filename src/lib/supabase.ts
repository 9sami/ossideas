import { createClient } from '@supabase/supabase-js';
import Cookies from 'js-cookie';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Custom storage implementation using cookies
const cookieStorage = {
  getItem: (key: string): string | null => {
    return Cookies.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    // Set cookie with secure options
    Cookies.set(key, value, {
      expires: 7, // 7 days
      secure: window.location.protocol === 'https:', // Only secure in production
      sameSite: 'lax', // CSRF protection
      path: '/', // Available across the entire site
    });
  },
  removeItem: (key: string): void => {
    Cookies.remove(key, { path: '/' });
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          location: string | null;
          avatar_url: string | null;
          phone_number: string | null;
          usage_purpose: string | null;
          industries: string[] | null;
          referral_source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          location?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          usage_purpose?: string | null;
          industries?: string[] | null;
          referral_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          location?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          usage_purpose?: string | null;
          industries?: string[] | null;
          referral_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}