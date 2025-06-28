import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Repository } from './useRepositories';

export function useRepositoryById(id: string | undefined) {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('No repository ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    const fetchRepository = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('repositories')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Repository not found');
          } else {
            setError(fetchError.message);
          }
          setRepository(null);
        } else if (data) {
          setRepository(data);
        } else {
          setError('No repository found');
          setRepository(null);
        }
      } catch (err) {
        console.error('Error fetching repository:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch repository',
        );
        setRepository(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [id]);

  return { repository, loading, error };
}
