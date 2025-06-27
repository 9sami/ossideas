import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import IdeaCard from './IdeaCard';
import FilterPanel from './FilterPanel';
import { IdeaData, FilterOptions } from '../types';
import { 
  useRepositories, 
  useNewRepositories, 
  useTrendingRepositories, 
  useCommunityPickRepositories,
  Repository 
} from '../hooks/useRepositories';
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

  // Main repositories hook for discovery section
  const { 
    repositories, 
    loading, 
    hasMore, 
    error, 
    loadMore, 
    applyFilters: applyRepoFilters,
    filters: repoFilters 
  } = useRepositories();

  // Specialized hooks for different sections
  const { newRepositories, loading: newLoading } = useNewRepositories();
  const { trendingRepositories, loading: trendingLoading } = useTrendingRepositories();
  const { communityRepositories, loading: communityLoading } = useCommunityPickRepositories();

  const observerRef = useRef<IntersectionObserver>();
  const lastRepositoryElementRef = useRef<HTMLDivElement>(null);

  // Convert Repository to IdeaData for compatibility with existing components
  const convertRepositoryToIdea = useCallback((repo: Repository): IdeaData => {
    const isNew = () => {
      if (!repo.created_at_github) return false;
      const createdDate = new Date(repo.created_at_github);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    };

    const isTrending = () => {
      // Consider trending if high stars and recent activity
      return repo.stargazers_count > 1000 && repo.last_commit_at && 
             new Date(repo.last_commit_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    };

    const isCommunityPick = () => {
      // Consider community pick if high engagement ratio
      const engagementRatio = (repo.forks_count + repo.watchers_count) / Math.max(repo.stargazers_count, 1);
      return engagementRatio > 0.1 && repo.stargazers_count > 500;
    };

    // Generate opportunity score based on repository metrics
    const calculateOpportunityScore = () => {
      let score = 0;
      
      // Stars contribution (0-30 points)
      if (repo.stargazers_count > 10000) score += 30;
      else if (repo.stargazers_count > 5000) score += 25;
      else if (repo.stargazers_count > 1000) score += 20;
      else if (repo.stargazers_count > 500) score += 15;
      else if (repo.stargazers_count > 100) score += 10;
      else score += 5;

      // Forks contribution (0-20 points)
      if (repo.forks_count > 1000) score += 20;
      else if (repo.forks_count > 500) score += 15;
      else if (repo.forks_count > 100) score += 10;
      else if (repo.forks_count > 50) score += 5;

      // Recent activity (0-20 points)
      if (repo.last_commit_at) {
        const daysSinceLastCommit = Math.floor((Date.now() - new Date(repo.last_commit_at).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastCommit < 7) score += 20;
        else if (daysSinceLastCommit < 30) score += 15;
        else if (daysSinceLastCommit < 90) score += 10;
        else if (daysSinceLastCommit < 180) score += 5;
      }

      // License bonus (0-10 points)
      if (repo.license_key && ['mit', 'apache-2.0', 'bsd-3-clause'].includes(repo.license_key.toLowerCase())) {
        score += 10;
      } else if (repo.license_key) {
        score += 5;
      }

      // Issues ratio (0-10 points) - fewer open issues is better
      const issuesRatio = repo.open_issues_count / Math.max(repo.stargazers_count, 1);
      if (issuesRatio < 0.01) score += 10;
      else if (issuesRatio < 0.05) score += 7;
      else if (issuesRatio < 0.1) score += 5;
      else if (issuesRatio < 0.2) score += 3;

      // AI Agent project bonus (0-10 points)
      if (repo.is_ai_agent_project) score += 10;

      return Math.min(100, Math.max(0, score));
    };

    return {
      id: repo.id,
      title: repo.name,
      tagline: repo.description || 'No description available',
      description: repo.readme_content || repo.description || 'No detailed description available for this repository.',
      ossProject: repo.full_name,
      categories: repo.topics || ['Open Source'],
      opportunityScore: calculateOpportunityScore(),
      license: repo.license_name || repo.license_key || 'Unknown',
      marketSize: '$1.2B (Estimated based on repository category)',
      targetAudience: 'Developers, Tech Companies, Open Source Community',
      monetizationStrategy: 'SaaS platform, Enterprise licensing, Professional services, API monetization',
      techStack: repo.languages ? Object.keys(repo.languages) : ['JavaScript', 'TypeScript'],
      competitiveAdvantage: `Open source foundation with ${repo.stargazers_count} stars and active community`,
      risks: [
        'Open source competition',
        'Technology adoption challenges',
        'Market saturation',
        'Regulatory compliance'
      ],
      isNew: isNew(),
      isTrending: isTrending(),
      communityPick: isCommunityPick(),
      isSaved: false
    };
  }, []);

  // Convert repositories to ideas for different sections
  const repositoryIdeas = useMemo(() => {
    return repositories.map(convertRepositoryToIdea);
  }, [repositories, convertRepositoryToIdea]);

  const newRepositoryIdeas = useMemo(() => {
    return newRepositories.map(convertRepositoryToIdea);
  }, [newRepositories, convertRepositoryToIdea]);

  const trendingRepositoryIdeas = useMemo(() => {
    return trendingRepositories.map(convertRepositoryToIdea);
  }, [trendingRepositories, convertRepositoryToIdea]);

  const communityRepositoryIdeas = useMemo(() => {
    return communityRepositories.map(convertRepositoryToIdea);
  }, [communityRepositories, convertRepositoryToIdea]);

  // Update repository filters when main filters change
  useEffect(() => {
    const newRepoFilters = {
      ...repoFilters,
      license_keys: filters.license.map(license => {
        // Map display names to license keys
        switch (license.toLowerCase()) {
          case 'mit': return 'mit';
          case 'apache': return 'apache-2.0';
          case 'gpl': return 'gpl-3.0';
          case 'bsd': return 'bsd-3-clause';
          case 'isc': return 'isc';
          default: return license.toLowerCase();
        }
      }),
      search_query: searchQuery,
      is_archived: filters.isNew ? false : null, // Don't show archived repos for new filter
    };

    applyRepoFilters(newRepoFilters);
  }, [filters, searchQuery, applyRepoFilters]);

  // Infinite scroll setup
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (lastRepositoryElementRef.current) {
      observerRef.current.observe(lastRepositoryElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);

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

  // Apply filtering based on section settings - NOW ONLY USING BACKEND DATA
  const trendingIdeas = useMemo(() => {
    // Only use trending repository ideas from backend
    return shouldFilterSection('trending') ? applyFilters(trendingRepositoryIdeas) : trendingRepositoryIdeas;
  }, [searchQuery, filters, trendingRepositoryIdeas]);

  const communityPicks = useMemo(() => {
    // Only use community repository ideas from backend
    return shouldFilterSection('community') ? applyFilters(communityRepositoryIdeas) : communityRepositoryIdeas;
  }, [searchQuery, filters, communityRepositoryIdeas]);

  const newArrivals = useMemo(() => {
    // Use new repository ideas - these are fetched immediately and sorted by creation date
    return shouldFilterSection('newArrivals') ? applyFilters(newRepositoryIdeas) : newRepositoryIdeas;
  }, [searchQuery, filters, newRepositoryIdeas]);

  // Personalized recommendations (filtered based on settings) - only repository ideas
  const personalizedIdeas = useMemo(() => {
    // Only use repository ideas for personalized recommendations
    const baseIdeas = repositoryIdeas.slice(0, 6);
    return shouldFilterSection('personalized') ? applyFilters(baseIdeas) : baseIdeas;
  }, [searchQuery, filters, repositoryIdeas]);

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
  const getSectionDescription = (sectionId: string, count: number, baseCount?: number) => {
    const isFiltered = shouldFilterSection(sectionId);
    if (hasActiveFilters && isFiltered) {
      return `${count} ${sectionId === 'trending' ? 'trending repositories' : 
                     sectionId === 'community' ? 'community favorites' :
                     sectionId === 'newArrivals' ? 'fresh repositories' :
                     sectionId === 'personalized' ? 'personalized recommendations' :
                     'repositories'} match your filters`;
    }
    
    switch (sectionId) {
      case 'trending':
        return `${count} hot repositories gaining momentum`;
      case 'community':
        return `${count} repositories loved by our community`;
      case 'newArrivals':
        return `${count} recently created repositories`;
      case 'personalized':
        return `${count} repositories tailored to your interests`;
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
      <div className="p-6 pt-4">
        {/*Built with bolt */}
        <div className="pb-3">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center space-x-1 px-5">
              <Zap className="h-5 w-5 text-orange-100 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold tracking-wide">BUILT WITH BOLT</span>
            </div>
          </a>
        </div>
        
        {/* Trending Ideas */}
        {(trendingIdeas.length > 0 || trendingLoading) && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  🔥 Trending Repositories
                  {shouldFilterSection('trending') && hasActiveFilters && (
                    <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      Filtered
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">
                  {trendingLoading ? 'Loading trending repositories...' : getSectionDescription('trending', trendingIdeas.length)}
                </p>
              </div>
            </div>
            
            {trendingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-[380px] animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trendingIdeas.slice(0, 8).map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onClick={() => onIdeaSelect(idea)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Community Picks */}
        {(communityPicks.length > 0 || communityLoading) && (
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
                  {communityLoading ? 'Loading community picks...' : getSectionDescription('community', communityPicks.length)}
                </p>
              </div>
            </div>
            
            {communityLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-[380px] animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {communityPicks.slice(0, 8).map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onClick={() => onIdeaSelect(idea)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* New Arrivals - Now loads immediately with dedicated hook */}
        {(newArrivals.length > 0 || newLoading) && (
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
                  {newLoading ? 'Loading new repositories...' : getSectionDescription('newArrivals', newArrivals.length)}
                </p>
              </div>
            </div>
            
            {newLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-[380px] animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newArrivals.slice(0, 8).map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onClick={() => onIdeaSelect(idea)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Show message if no new repositories found */}
        {!newLoading && newArrivals.length === 0 && shouldFilterSection('newArrivals') && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  ✨ New Arrivals
                </h2>
                <p className="text-gray-600">
                  No new repositories found in the last 30 days
                </p>
              </div>
            </div>
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Check back later for newly created repositories!</p>
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
                  {getSectionDescription('personalized', personalizedIdeas.length)}
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

        {/* Main Discovery Section - Dynamic Repositories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                Discover Repositories
                {shouldFilterSection('discovery') && hasActiveFilters && (
                  <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                    Filtered
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                {hasActiveFilters && shouldFilterSection('discovery')
                  ? `${repositoryIdeas.length} repositories found${searchQuery ? ` for "${searchQuery}"` : ''}`
                  : `${repositoryIdeas.length} curated repositories from open source projects`
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

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <ExternalLink className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Repositories</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Repository Grid */}
          {!error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {repositoryIdeas.map((idea, index) => (
                <div
                  key={idea.id}
                  ref={index === repositoryIdeas.length - 1 ? lastRepositoryElementRef : null}
                >
                  <IdeaCard
                    idea={idea}
                    onClick={() => onIdeaSelect(idea)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading repositories...</p>
            </div>
          )}

          {/* No More Results */}
          {!loading && !hasMore && repositoryIdeas.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">You've reached the end of the repositories!</p>
            </div>
          )}

          {/* No Results State */}
          {!loading && repositoryIdeas.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No repositories found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your search or filters to find more repositories.'
                  : 'No repositories are currently available.'
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
    </div>
  );
};

export default MainContent;