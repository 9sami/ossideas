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

export const useSubmissions = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    if (!user) {
      setSubmissions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('submitted_repositories')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch submissions',
      );
    } finally {
      setLoading(false);
    }
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
      await fetchSubmissions();
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
      await fetchSubmissions();
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
    fetchSubmissions();
  }, [user]);

  return {
    submissions,
    loading,
    error,
    fetchSubmissions,
    updateSubmission,
    deleteSubmission,
  };
};
