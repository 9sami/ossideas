import React, { useState } from 'react';
import { Search, Filter, User, Menu, LogIn, LogOut } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOpen: boolean;
  onFilterToggle: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  isLoggedIn: boolean;
  loading: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  user: UserType | null;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  filterOpen,
  onFilterToggle,
  onProfileClick,
  onLogoClick,
  isLoggedIn,
  loading,
  onLoginClick,
  onLogoutClick,
  user
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
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

          {/* Search Bar */}
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

          {/* Filter and Profile */}
          <div className="flex items-center space-x-4">
            {/* Filter Button */}
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

            {/* Profile/Login */}
            {loading ? (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                <span className="hidden sm:inline text-sm">Loading...</span>
              </div>
            ) : isLoggedIn && user ? (
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
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user.fullName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
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