import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface UserActivity {
  id: string;
  action: string;
  idea_id: string;
  created_at: string;
  ideas: {
    title: string;
  } | null;
}

interface SupabaseActivity {
  id: string;
  action: string;
  idea_id: string;
  created_at: string;
  ideas: { title: string }[] | { title: string } | null;
}

export function useUserActivity() {
  const {
    authState: { user },
  } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select(
          `
          id,
          action,
          idea_id,
          created_at,
          ideas (
            title
          )
        `,
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      if (data) {
        const formattedData = data.map((activity: SupabaseActivity) => ({
          ...activity,
          ideas: Array.isArray(activity.ideas)
            ? activity.ideas[0]
            : activity.ideas,
        }));
        setActivities(formattedData as UserActivity[]);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching user activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, fetchActivities };
}
