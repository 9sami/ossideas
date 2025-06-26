import React, { useState, useMemo } from 'react';
import IdeaCard from './IdeaCard';
import FilterPanel from './FilterPanel';
import { IdeaData, FilterOptions } from '../types';
import { mockIdeas } from '../data/mockData';

interface MainContentProps {
  searchQuery: string;
  filterOpen: boolean;
  onIdeaSelect: (idea: IdeaData) => void;
  isLoggedIn: boolean;
  onRegisterClick: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  searchQuery,
  filterOpen,
  onIdeaSelect,
  isLoggedIn,
  onRegisterClick
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    opportunityScore: [0, 100],
    license: [],
    isNew: false,
    isTrending: false,
    communityPick: false
  });

  // Apply filters to all ideas
  const filteredIdeas = useMemo(() => {
    return mockIdeas.filter(idea => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !idea.title.toLowerCase().includes(query) &&
          !idea.description.toLowerCase().includes(query) &&
          !idea.ossProject.toLowerCase().includes(query) &&
          !idea.categories.some(cat => cat.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.some(cat => idea.categories.includes(cat))) {
        return false;
      }

      // Opportunity score filter
      if (idea.opportunityScore < filters.opportunityScore[0] || idea.opportunityScore > filters.opportunityScore[1]) {
        return false;
      }

      // License filter
      if (filters.license.length > 0 && !filters.license.includes(idea.license)) {
        return false;
      }

      // Special filters
      if (filters.isNew && !idea.isNew) return false;
      if (filters.isTrending && !idea.isTrending) return false;
      if (filters.communityPick && !idea.communityPick) return false;

      return true;
    });
  }, [searchQuery, filters]);

  // Apply the same filtering logic to each section
  const trendingIdeas = useMemo(() => {
    return filteredIdeas.filter(idea => idea.isTrending);
  }, [filteredIdeas]);

  const communityPicks = useMemo(() => {
    return filteredIdeas.filter(idea => idea.communityPick);
  }, [filteredIdeas]);

  const newArrivals = useMemo(() => {
    return filteredIdeas.filter(idea => idea.isNew);
  }, [filteredIdeas]);

  // Personalized recommendations (filtered)
  const personalizedIdeas = useMemo(() => {
    // For demo purposes, we'll use the first 6 filtered ideas
    // In a real app, this would be based on user preferences
    return filteredIdeas.slice(0, 6);
  }, [filteredIdeas]);

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery ||
    filters.categories.length > 0 ||
    filters.license.length > 0 ||
    filters.isNew ||
    filters.isTrending ||
    filters.communityPick ||
    filters.opportunityScore[0] > 0 ||
    filters.opportunityScore[1] < 100;

  return (
    <div className="p-6">
      {filterOpen && (
        <FilterPanel 
          filters={filters}
          onFilterChange={setFilters}
        />
      )}

      {/* Trending Ideas */}
      {trendingIdeas.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🔥 Trending Ideas</h2>
              <p className="text-gray-600">
                {hasActiveFilters 
                  ? `${trendingIdeas.length} trending ideas match your filters`
                  : `${trendingIdeas.length} hot ideas gaining momentum`
                }
              </p>
            </div>
            {!isLoggedIn && (
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800 mb-2">
                  Get personalized recommendations
                </p>
                <button 
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingIdeas.slice(0, 8).map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => onIdeaSelect(idea)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Community Picks */}
      {communityPicks.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">👥 Community Picks</h2>
              <p className="text-gray-600">
                {hasActiveFilters 
                  ? `${communityPicks.length} community favorites match your filters`
                  : `${communityPicks.length} ideas loved by our community`
                }
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {communityPicks.slice(0, 8).map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => onIdeaSelect(idea)}
              />
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">✨ New Arrivals</h2>
              <p className="text-gray-600">
                {hasActiveFilters 
                  ? `${newArrivals.length} fresh ideas match your filters`
                  : `${newArrivals.length} recently added opportunities`
                }
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.slice(0, 8).map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => onIdeaSelect(idea)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Personalized Recommendations (if logged in) */}
      {isLoggedIn && personalizedIdeas.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Recommended For You</h2>
              <p className="text-gray-600">
                {hasActiveFilters 
                  ? `${personalizedIdeas.length} personalized recommendations match your filters`
                  : `${personalizedIdeas.length} ideas tailored to your interests`
                }
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {personalizedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => onIdeaSelect(idea)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Discovery Section - MOVED TO BOTTOM */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Your Next Big Idea
            </h1>
            <p className="text-gray-600">
              {hasActiveFilters 
                ? `${filteredIdeas.length} ideas found${searchQuery ? ` for "${searchQuery}"` : ''}`
                : `${filteredIdeas.length} curated startup opportunities from open source projects`
              }
            </p>
          </div>
          {!isLoggedIn && (
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 mb-2">
                Get personalized recommendations
              </p>
              <button 
                onClick={onRegisterClick}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                Sign Up Free
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onClick={() => onIdeaSelect(idea)}
            />
          ))}
        </div>
      </div>

      {/* No Results State */}
      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters 
              ? 'Try adjusting your search or filters to find more ideas.'
              : 'No ideas are currently available.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilters({
                  categories: [],
                  opportunityScore: [0, 100],
                  license: [],
                  isNew: false,
                  isTrending: false,
                  communityPick: false
                });
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MainContent;