import React, { useState, useMemo } from 'react';
import IdeaCard from './IdeaCard';
import FilterPanel from './FilterPanel';
import { IdeaData, FilterOptions } from '../types';
import { mockIdeas } from '../data/mockData';
import { Heart, Zap, ExternalLink } from 'lucide-react';
interface MainContentProps {
  searchQuery: string;
  filterOpen: boolean;
  onIdeaSelect: (idea: IdeaData) => void;
  isLoggedIn: boolean;
  onRegisterClick: () => void;
  onFilterToggle: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  searchQuery,
  filterOpen,
  onIdeaSelect,
  isLoggedIn,
  onRegisterClick,
  onFilterToggle
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    opportunityScore: [0, 100],
    license: [],
    isNew: false,
    isTrending: false,
    communityPick: false,
    appliedSections: ['trending', 'community', 'newArrivals', 'personalized', 'discovery']
  });

  // Helper function to apply filters to ideas
  const applyFilters = (ideas: IdeaData[]) => {
    return ideas.filter(idea => {
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
  };

  // Helper function to check if a section should be filtered
  const shouldFilterSection = (sectionId: string) => {
    return (filters.appliedSections || []).includes(sectionId);
  };

  // Apply filtering based on section settings
  const trendingIdeas = useMemo(() => {
    const baseIdeas = mockIdeas.filter(idea => idea.isTrending);
    return shouldFilterSection('trending') ? applyFilters(baseIdeas) : baseIdeas;
  }, [searchQuery, filters]);

  const communityPicks = useMemo(() => {
    const baseIdeas = mockIdeas.filter(idea => idea.communityPick);
    return shouldFilterSection('community') ? applyFilters(baseIdeas) : baseIdeas;
  }, [searchQuery, filters]);

  const newArrivals = useMemo(() => {
    const baseIdeas = mockIdeas.filter(idea => idea.isNew);
    return shouldFilterSection('newArrivals') ? applyFilters(baseIdeas) : baseIdeas;
  }, [searchQuery, filters]);

  // Personalized recommendations (filtered based on settings)
  const personalizedIdeas = useMemo(() => {
    const baseIdeas = mockIdeas.slice(0, 6);
    return shouldFilterSection('personalized') ? applyFilters(baseIdeas) : baseIdeas;
  }, [searchQuery, filters]);

  // Main discovery section (always respects filters if enabled)
  const discoveryIdeas = useMemo(() => {
    return shouldFilterSection('discovery') ? applyFilters(mockIdeas) : mockIdeas;
  }, [searchQuery, filters]);

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

  // Helper function to get section description
  const getSectionDescription = (sectionId: string, count: number, baseCount: number) => {
    const isFiltered = shouldFilterSection(sectionId);
    if (hasActiveFilters && isFiltered) {
      return `${count} ${sectionId === 'trending' ? 'trending ideas' : 
                     sectionId === 'community' ? 'community favorites' :
                     sectionId === 'newArrivals' ? 'fresh ideas' :
                     sectionId === 'personalized' ? 'personalized recommendations' :
                     'ideas'} match your filters`;
    }
    
    switch (sectionId) {
      case 'trending':
        return `${count} hot ideas gaining momentum`;
      case 'community':
        return `${count} ideas loved by our community`;
      case 'newArrivals':
        return `${count} recently added opportunities`;
      case 'personalized':
        return `${count} ideas tailored to your interests`;
      default:
        return `${count} curated startup opportunities from open source projects`;
    }
  };

  return (
    <div>
      {/* Filter Panel - Top Bar */}
      <FilterPanel 
        filters={filters}
        onFilterChange={setFilters}
        isOpen={filterOpen}
        onClose={onFilterToggle}
      />

      {/* Main Content */}
      <div className="p-6 inline-block">
        {/*Built with bolt */}
        <div>
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-100 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold tracking-wide">BUILT WITH BOLT</span>
            </div>
            <div className="w-px h-6 bg-orange-300"></div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-200 animate-pulse" />
              <span className="text-xs text-orange-100 group-hover:text-white transition-colors">
                Hackathon 2024
              </span>
            </div>
            <ExternalLink className="h-4 w-4 text-orange-200 group-hover:text-white transition-colors" />
          </a>
        </div>
        
        {/* Trending Ideas */}
        {trendingIdeas.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  🔥 Trending Ideas
                  {shouldFilterSection('trending') && hasActiveFilters && (
                    <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      Filtered
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">
                  {getSectionDescription('trending', trendingIdeas.length, mockIdeas.filter(i => i.isTrending).length)}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  👥 Community Picks
                  {shouldFilterSection('community') && hasActiveFilters && (
                    <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      Filtered
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">
                  {getSectionDescription('community', communityPicks.length, mockIdeas.filter(i => i.communityPick).length)}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  ✨ New Arrivals
                  {shouldFilterSection('newArrivals') && hasActiveFilters && (
                    <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      Filtered
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">
                  {getSectionDescription('newArrivals', newArrivals.length, mockIdeas.filter(i => i.isNew).length)}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  🎯 Recommended For You
                  {shouldFilterSection('personalized') && hasActiveFilters && (
                    <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      Filtered
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">
                  {getSectionDescription('personalized', personalizedIdeas.length, 6)}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                Discover Your Next Big Idea
                {shouldFilterSection('discovery') && hasActiveFilters && (
                  <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                    Filtered
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                {hasActiveFilters && shouldFilterSection('discovery')
                  ? `${discoveryIdeas.length} ideas found${searchQuery ? ` for "${searchQuery}"` : ''}`
                  : `${discoveryIdeas.length} curated startup opportunities from open source projects`
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
            {discoveryIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => onIdeaSelect(idea)}
              />
            ))}
          </div>
        </div>

        {/* No Results State */}
        {discoveryIdeas.length === 0 && shouldFilterSection('discovery') && (
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
                    communityPick: false,
                    appliedSections: ['trending', 'community', 'newArrivals', 'personalized', 'discovery']
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
    </div>
  );
};

export default MainContent;