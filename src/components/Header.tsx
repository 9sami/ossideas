import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, User, Menu, LogIn, LogOut, Crown } from 'lucide-react';
import { User as UserType } from '../types/auth';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOpen: boolean;
  onFilterToggle: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  user: UserType | null;
  currentView?: string; // Add currentView prop to know which page we're on
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  filterOpen,
  onFilterToggle,
  onProfileClick,
  onLogoClick,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  user,
  currentView = 'home' // Default to home if not provided
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);

  const fetchUserSubscription = useCallback(async () => {
    if (!user) {
      setUserSubscription(null);
      return;
    }

    try {
      // Get the most recent active subscription for this user
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle to handle 0 or 1 results

      if (error) {
        console.error('Error fetching subscription:', error);
        setUserSubscription(null);
        return;
      }

      setUserSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setUserSubscription(null);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserSubscription();
  }, [fetchUserSubscription]);

  // Set up real-time subscription updates
  useEffect(() => {
    if (!user) return;

    // Subscribe to subscription changes for this user
    const subscriptionChannel = supabase
      .channel('header-subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Header: Subscription changed:', payload);
          // Refresh subscription data when changes occur
          fetchUserSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscriptionChannel);
    };
  }, [user?.id, fetchUserSubscription]);

  const getSubscriptionStatus = () => {
    if (!userSubscription) return null;
    
    const status = userSubscription.status;
    if (status === 'active' || status === 'trialing') {
      return userSubscription.plan_name;
    }
    return null;
  };

  // Determine if we should show search and filter (only on home page)
  const showSearchAndFilter = currentView === 'home';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="ml-2 flex items-center">
            <button
              onClick={onLogoClick}
              className="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-orange-500 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OS</span>
              </div>
              <span>OSSIdeas</span>
            </button>
          </div>

          {/* Search Bar - Only show on home page */}
          {showSearchAndFilter && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search ideas, OSS projects, or keywords..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* Filter and Profile */}
          <div className="flex items-center space-x-4">
            {/* Filter Button - Only show on home page */}
            {showSearchAndFilter && (
              <button
                onClick={onFilterToggle}
                className={`p-2 rounded-lg transition-colors ${
                  filterOpen 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-orange-500'
                }`}
              >
                <Filter className="h-5 w-5" />
              </button>
            )}

            {/* Profile/Login */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-orange-500 transition-colors"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || user.email}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium">
                      {user.fullName || user.email.split('@')[0]}
                    </div>
                    {getSubscriptionStatus() && (
                      <div className="flex items-center text-xs text-orange-600">
                        <Crown className="h-3 w-3 mr-1" />
                        {getSubscriptionStatus()}
                      </div>
                    )}
                  </div>
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user.fullName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {getSubscriptionStatus() && (
                        <div className="flex items-center text-xs text-orange-600 mt-1">
                          <Crown className="h-3 w-3 mr-1" />
                          {getSubscriptionStatus()} Plan
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        onProfileClick();
                        setProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        onProfileClick();
                        setProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Saved Ideas
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Submissions
                    </button>
                    <hr className="my-1" />
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Help & Support
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        onLogoutClick();
                        setProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;