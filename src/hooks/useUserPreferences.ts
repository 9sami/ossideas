import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Category } from '../types';

export function useUserPreferences() {
  const {
    authState: { user },
  } = useAuth();
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserCategories = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_categories')
        .select('categories(*)')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
      if (data) {
        const categories = data
          .map((item) => item.categories)
          .filter((category): category is Category => category !== null);
        setUserCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching user categories:', error);
      setUserCategories([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserCategories();
  }, [fetchUserCategories]);

  const updateUserCategories = async (categoryIds: number[]) => {
    if (!user) {
      console.error('User not found');
      return;
    }

    const { error: deleteError } = await supabase
      .from('user_categories')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error clearing user categories:', deleteError);
      throw deleteError;
    }

    if (categoryIds.length > 0) {
      const newLinks = categoryIds.map((categoryId) => ({
        user_id: user.id,
        category_id: categoryId,
      }));
      const { error: insertError } = await supabase
        .from('user_categories')
        .insert(newLinks);

      if (insertError) {
        console.error('Error inserting user categories:', insertError);
        throw insertError;
      }
    }
    await fetchUserCategories();
  };

  return {
    userCategories,
    loading,
    fetchUserCategories,
    updateUserCategories,
  };
}
