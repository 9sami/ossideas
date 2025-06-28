import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Submission {
  id: string;
  user_id: string;
  github_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  submitted_at: string;
  processed_at: string | null;
  notes: string | null;
}

const ITEMS_PER_PAGE = 10;

export const useSubmissions = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchSubmissions = async (page: number = 0, reset: boolean = false) => {
    if (!user) {
      setSubmissions([]);
      setTotalCount(0);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get total count
      const { count, error: countError } = await supabase
        .from('submitted_repositories')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) {
        throw countError;
      }

      setTotalCount(count || 0);

      // Then fetch paginated data
      const { data, error: fetchError } = await supabase
        .from('submitted_repositories')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

      if (fetchError) {
        throw fetchError;
      }

      if (reset) {
        setSubmissions(data || []);
      } else {
        setSubmissions((prev) => [...prev, ...(data || [])]);
      }

      setHasMore((data || []).length === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch submissions',
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!loading && hasMore) {
      await fetchSubmissions(currentPage + 1, false);
    }
  };

  const refreshSubmissions = async () => {
    await fetchSubmissions(0, true);
  };

  const updateSubmission = async (id: string, updates: Partial<Submission>) => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('submitted_repositories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh the submissions list
      await refreshSubmissions();
      return true;
    } catch (err) {
      console.error('Error updating submission:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to update submission',
      );
      return false;
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('submitted_repositories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Refresh the submissions list
      await refreshSubmissions();
      return true;
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to delete submission',
      );
      return false;
    }
  };

  // Load submissions when user changes
  useEffect(() => {
    fetchSubmissions(0, true);
  }, [user]);

  return {
    submissions,
    loading,
    error,
    currentPage,
    totalCount,
    hasMore,
    itemsPerPage: ITEMS_PER_PAGE,
    fetchSubmissions,
    loadMore,
    refreshSubmissions,
    updateSubmission,
    deleteSubmission,
  };
};
