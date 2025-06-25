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

  const trendingIdeas = mockIdeas.filter(idea => idea.isTrending);
  const communityPicks = mockIdeas.filter(idea => idea.communityPick);
  const newArrivals = mockIdeas.filter(idea => idea.isNew);

  return (
    <div className="p-6">
      {filterOpen && (
        <FilterPanel 
          filters={filters}
          onFilterChange={setFilters}
        />
      )}

      {/* Hero Section - Main Idea Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Your Next Big Idea
            </h1>
            <p className="text-gray-600">
              {searchQuery 
                ? `${filteredIdeas.length} ideas found for "${searchQuery}"`
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

      {/* Trending Ideas */}
      {trendingIdeas.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Trending Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingIdeas.slice(0, 6).map((idea) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Community Picks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityPicks.slice(0, 6).map((idea) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ New Arrivals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.slice(0, 6).map((idea) => (
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
      {isLoggedIn && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockIdeas.slice(0, 6).map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => onIdeaSelect(idea)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find more ideas.</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;