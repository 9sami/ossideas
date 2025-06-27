import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Repository {
  id: string;
  github_repo_id: number;
  owner: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  license_key: string | null;
  license_name: string | null;
  last_commit_at: string | null;
  created_at_github: string | null;
  updated_at_github: string | null;
  is_archived: boolean;
  topics: string[] | null;
  readme_content: string | null;
  scanned_at: string;
  data_quality_score: number | null;
  is_ai_agent_project: boolean;
  additional_metadata: any;
  languages: any;
}

export interface RepositoryFilters {
  license_keys: string[];
  min_forks: number;
  max_forks: number;
  min_watchers: number;
  max_watchers: number;
  min_stars: number;
  max_stars: number;
  min_issues: number;
  max_issues: number;
  last_commit_days: number;
  is_archived: boolean | null;
  topics: string[];
  is_ai_agent: boolean | null;
  search_query: string;
}

const ITEMS_PER_PAGE = 12;

export const useRepositories = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<RepositoryFilters>({
    license_keys: [],
    min_forks: 0,
    max_forks: 100000,
    min_watchers: 0,
    max_watchers: 100000,
    min_stars: 0,
    max_stars: 100000,
    min_issues: 0,
    max_issues: 10000,
    last_commit_days: 365,
    is_archived: null,
    topics: [],
    is_ai_agent: null,
    search_query: '',
  });

  const buildQuery = useCallback((page: number, currentFilters: RepositoryFilters) => {
    let query = supabase
      .from('repositories')
      .select('*')
      .order('stargazers_count', { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    // Apply filters
    if (currentFilters.license_keys.length > 0) {
      query = query.in('license_key', currentFilters.license_keys);
    }

    if (currentFilters.min_forks > 0) {
      query = query.gte('forks_count', currentFilters.min_forks);
    }

    if (currentFilters.max_forks < 100000) {
      query = query.lte('forks_count', currentFilters.max_forks);
    }

    if (currentFilters.min_watchers > 0) {
      query = query.gte('watchers_count', currentFilters.min_watchers);
    }

    if (currentFilters.max_watchers < 100000) {
      query = query.lte('watchers_count', currentFilters.max_watchers);
    }

    if (currentFilters.min_stars > 0) {
      query = query.gte('stargazers_count', currentFilters.min_stars);
    }

    if (currentFilters.max_stars < 100000) {
      query = query.lte('stargazers_count', currentFilters.max_stars);
    }

    if (currentFilters.min_issues > 0) {
      query = query.gte('open_issues_count', currentFilters.min_issues);
    }

    if (currentFilters.max_issues < 10000) {
      query = query.lte('open_issues_count', currentFilters.max_issues);
    }

    if (currentFilters.last_commit_days < 365) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - currentFilters.last_commit_days);
      query = query.gte('last_commit_at', cutoffDate.toISOString());
    }

    if (currentFilters.is_archived !== null) {
      query = query.eq('is_archived', currentFilters.is_archived);
    }

    if (currentFilters.is_ai_agent !== null) {
      query = query.eq('is_ai_agent_project', currentFilters.is_ai_agent);
    }

    if (currentFilters.topics.length > 0) {
      query = query.overlaps('topics', currentFilters.topics);
    }

    if (currentFilters.search_query) {
      query = query.or(`full_name.ilike.%${currentFilters.search_query}%,description.ilike.%${currentFilters.search_query}%`);
    }

    return query;
  }, []);

  const fetchRepositories = useCallback(async (page: number = 0, reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await buildQuery(page, filters);

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        if (reset) {
          setRepositories(data);
        } else {
          setRepositories(prev => [...prev, ...data]);
        }

        setHasMore(data.length === ITEMS_PER_PAGE);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, filters, loading]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchRepositories(currentPage + 1, false);
    }
  }, [fetchRepositories, currentPage, loading, hasMore]);

  const applyFilters = useCallback((newFilters: RepositoryFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
    setRepositories([]);
    setHasMore(true);
  }, []);

  const resetFilters = useCallback(() => {
    const defaultFilters: RepositoryFilters = {
      license_keys: [],
      min_forks: 0,
      max_forks: 100000,
      min_watchers: 0,
      max_watchers: 100000,
      min_stars: 0,
      max_stars: 100000,
      min_issues: 0,
      max_issues: 10000,
      last_commit_days: 365,
      is_archived: null,
      topics: [],
      is_ai_agent: null,
      search_query: '',
    };
    applyFilters(defaultFilters);
  }, [applyFilters]);

  // Initial fetch
  useEffect(() => {
    fetchRepositories(0, true);
  }, [filters]);

  return {
    repositories,
    loading,
    hasMore,
    error,
    filters,
    loadMore,
    applyFilters,
    resetFilters,
    refetch: () => fetchRepositories(0, true),
  };
};

// New hook specifically for fetching new repositories
export const useNewRepositories = () => {
  const [newRepositories, setNewRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewRepositories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error: fetchError } = await supabase
        .from('repositories')
        .select('*')
        .gte('created_at_github', thirtyDaysAgo.toISOString())
        .eq('is_archived', false)
        .order('created_at_github', { ascending: false })
        .limit(20); // Get up to 20 new repositories

      if (fetchError) {
        throw fetchError;
      }

      setNewRepositories(data || []);
    } catch (err) {
      console.error('Error fetching new repositories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch new repositories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewRepositories();
  }, [fetchNewRepositories]);

  return {
    newRepositories,
    loading,
    error,
    refetch: fetchNewRepositories,
  };
};

// Hook for fetching trending repositories
export const useTrendingRepositories = () => {
  const [trendingRepositories, setTrendingRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingRepositories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate date 7 days ago for recent activity
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error: fetchError } = await supabase
        .from('repositories')
        .select('*')
        .gte('stargazers_count', 1000)
        .gte('last_commit_at', sevenDaysAgo.toISOString())
        .eq('is_archived', false)
        .order('stargazers_count', { ascending: false })
        .limit(20); // Get up to 20 trending repositories

      if (fetchError) {
        throw fetchError;
      }

      setTrendingRepositories(data || []);
    } catch (err) {
      console.error('Error fetching trending repositories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trending repositories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingRepositories();
  }, [fetchTrendingRepositories]);

  return {
    trendingRepositories,
    loading,
    error,
    refetch: fetchTrendingRepositories,
  };
};

// Hook for fetching community pick repositories
export const useCommunityPickRepositories = () => {
  const [communityRepositories, setCommunityRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunityRepositories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('repositories')
        .select('*')
        .gte('stargazers_count', 500)
        .eq('is_archived', false)
        .order('stargazers_count', { ascending: false })
        .limit(20); // Get up to 20 community pick repositories

      if (fetchError) {
        throw fetchError;
      }

      // Filter for high engagement ratio (community picks)
      const communityPicks = (data || []).filter(repo => {
        const engagementRatio = (repo.forks_count + repo.watchers_count) / Math.max(repo.stargazers_count, 1);
        return engagementRatio > 0.1;
      });

      setCommunityRepositories(communityPicks);
    } catch (err) {
      console.error('Error fetching community repositories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch community repositories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunityRepositories();
  }, [fetchCommunityRepositories]);

  return {
    communityRepositories,
    loading,
    error,
    refetch: fetchCommunityRepositories,
  };
};