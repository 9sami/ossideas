import React, { useState, useMemo } from 'react';
import {
  Heart,
  User,
  Settings,
  TrendingUp,
  Plus,
  ExternalLink,
  Star,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { IdeaData } from '../types';
import { User as UserType } from '../types/auth';
import FullScreenLoader from './FullScreenLoader';
import { useSavedIdeas } from '../hooks/useSavedIdeas';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  onIdeaSelect: (idea: IdeaData) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  user: UserType | null;
}

const UserProfile: React.FC<UserProfileProps> = ({
  isLoggedIn,
  onLoginClick,
  user,
}) => {
  const [activeTab, setActiveTab] = useState<
    'saved' | 'preferences' | 'activity'
  >('saved');
  const [loading] = useState(false);
  const navigate = useNavigate();
  const { savedIdeas: realSavedIdeas, loading: savedIdeasLoading } =
    useSavedIdeas();

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const userCategories = ['AI/ML', 'DevTools', 'SaaS', 'Data Analytics'];

  // Filter ideas based on search query
  const filteredIdeas = useMemo(() => {
    if (!searchQuery.trim()) return realSavedIdeas;

    const query = searchQuery.toLowerCase();
    return realSavedIdeas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(query) ||
        idea.tagline.toLowerCase().includes(query) ||
        idea.description.toLowerCase().includes(query) ||
        idea.ossProject.toLowerCase().includes(query) ||
        idea.categories.some((category) =>
          category.toLowerCase().includes(query),
        ),
    );
  }, [realSavedIdeas, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIdeas = filteredIdeas.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const stats = [
    {
      label: 'Saved Ideas',
      value: realSavedIdeas.length.toString(),
      icon: Heart,
      color: 'text-red-500',
    },
    {
      label: 'Categories',
      value: '4',
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    { label: 'Submissions', value: '3', icon: Plus, color: 'text-green-500' },
  ];

  const handleIdeaClick = (idea: IdeaData) => {
    navigate(`/ideas/${idea.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return <FullScreenLoader message="Loading profile..." />;
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sign in to view your profile
          </h2>
          <p className="text-gray-600 mb-4">
            Access your saved ideas and preferences
          </p>
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                {getInitials(user.fullName, user.email)}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {user.fullName || 'User'}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {user.email}
                </p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:items-center sm:gap-6">
              <div className="w-full sm:w-auto">
                <div className="grid grid-cols-3 gap-4 mb-4 sm:mb-0 sm:gap-6">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="text-center">
                        <Icon
                          className={`h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 ${stat.color}`}
                        />
                        <div
                          className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {stat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-8 overflow-x-auto">
              {[
                { id: 'saved', label: 'Saved Ideas', icon: Heart },
                { id: 'preferences', label: 'Preferences', icon: Settings },
                { id: 'activity', label: 'Activity', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as 'saved' | 'preferences' | 'activity',
                      )
                    }
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}>
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {/* Saved Ideas Tab */}
            {activeTab === 'saved' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Saved Ideas
                  </h2>
                  <span className="text-sm text-gray-600">
                    {realSavedIdeas.length} ideas saved
                  </span>
                </div>

                {savedIdeasLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-600">
                      Loading saved ideas...
                    </span>
                  </div>
                ) : realSavedIdeas.length > 0 ? (
                  <div>
                    {/* Search Bar */}
                    <div className="mb-6">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search saved ideas by title, description, repository, or categories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        />
                        {searchQuery && (
                          <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                            <span className="text-lg">×</span>
                          </button>
                        )}
                      </div>
                      {searchQuery && (
                        <div className="mt-2 text-sm text-gray-600">
                          Found {filteredIdeas.length} of{' '}
                          {realSavedIdeas.length} ideas
                        </div>
                      )}
                    </div>

                    {/* Cards for mobile, Table for desktop */}
                    <div className="block sm:hidden">
                      {currentIdeas.map((idea) => (
                        <div
                          key={idea.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleIdeaClick(idea)}>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 hover:text-orange-600 transition-colors flex-1 pr-2">
                              {idea.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(
                                idea.opportunityScore,
                              )}`}>
                              <Star className="h-3 w-3 mr-1" />
                              {idea.opportunityScore}/10
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {idea.tagline}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {idea.categories.slice(0, 3).map((category) => (
                              <span
                                key={category}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {category}
                              </span>
                            ))}
                            {idea.categories.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{idea.categories.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5" />
                              Saved: {formatDate(new Date().toISOString())}
                            </div>
                            <span className="text-gray-600 truncate">
                              {idea.ossProject}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-x-auto hidden sm:block">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Idea
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Categories
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Score
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Repository
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Saved
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentIdeas.map((idea) => (
                            <tr
                              key={idea.id}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleIdeaClick(idea)}>
                              <td className="py-4 px-4">
                                <div>
                                  <h3 className="font-medium text-gray-900 hover:text-orange-600 transition-colors">
                                    {idea.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {idea.tagline}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {idea.categories
                                    .slice(0, 2)
                                    .map((category) => (
                                      <span
                                        key={category}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {category}
                                      </span>
                                    ))}
                                  {idea.categories.length > 2 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                      +{idea.categories.length - 2}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(
                                    idea.opportunityScore,
                                  )}`}>
                                  <Star className="h-3 w-3 mr-1" />
                                  {idea.opportunityScore}/10
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm text-gray-600">
                                  {idea.ossProject}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(new Date().toISOString())}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleIdeaClick(idea);
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-700">
                          Showing {startIndex + 1} to{' '}
                          {Math.min(endIndex, filteredIdeas.length)} of{' '}
                          {filteredIdeas.length} results
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Previous</span>
                          </button>

                          <div className="flex items-center space-x-1">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1,
                            ).map((page) => {
                              // Show first page, last page, current page, and pages around current
                              const shouldShow =
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - currentPage) <= 1;

                              if (!shouldShow) {
                                if (page === 2 || page === totalPages - 1) {
                                  return (
                                    <span
                                      key={page}
                                      className="px-1 sm:px-2 text-gray-500">
                                      ...
                                    </span>
                                  );
                                }
                                return null;
                              }

                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                                    currentPage === page
                                      ? 'bg-orange-500 text-white'
                                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                  }`}>
                                  {page}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4 sm:ml-1" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No saved ideas yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start exploring and save ideas that interest you!
                    </p>
                    <button
                      onClick={() => navigate('/ideas')}
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Explore Ideas
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Preferred Categories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      'AI/ML',
                      'DevTools',
                      'SaaS',
                      'E-commerce',
                      'Data Analytics',
                      'Security',
                      'Mobile',
                      'Web Dev',
                    ].map((category) => (
                      <label
                        key={category}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={userCategories.includes(category)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    {[
                      'New ideas in preferred categories',
                      'Weekly trending ideas digest',
                      'Community updates and picks',
                      'New features and announcements',
                    ].map((pref) => (
                      <label key={pref} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Saved idea',
                      title: 'AI-Powered Documentation Generator',
                      time: '2 hours ago',
                    },
                    {
                      action: 'Viewed idea',
                      title: 'Real-time Collaboration Platform',
                      time: '5 hours ago',
                    },
                    {
                      action: 'Saved idea',
                      title: 'Smart Contract Testing Suite',
                      time: '1 day ago',
                    },
                    {
                      action: 'Submitted idea',
                      title: 'GraphQL Schema Validator',
                      time: '3 days ago',
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-2">
                      <div>
                        <span className="text-sm text-gray-600">
                          {activity.action}
                        </span>
                        <h4 className="font-medium text-gray-900">
                          {activity.title}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
