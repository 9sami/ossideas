import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { IdeaData } from '../types';
import { convertIdeaToIdeaData, Idea } from './useIdeas';

type SavedIdeaRecord = {
  idea_id: string;
  notes: string | null;
  idea: Idea;
};

export const useSavedIdeas = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [savedIdeas, setSavedIdeas] = useState<IdeaData[]>([]);
  const [savedIdeaIds, setSavedIdeaIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved ideas for the current user
  const fetchSavedIdeas = async () => {
    if (!user) {
      setSavedIdeas([]);
      setSavedIdeaIds(new Set());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch saved ideas with a single query using a join
      const { data: savedRecords, error: savedError } = await supabase
        .from('user_saved_ideas')
        .select<string, SavedIdeaRecord>(
          `
          idea_id,
          notes,
          idea:ideas!inner(
            *,
            repository:repositories(
              id,
              full_name,
              description,
              stargazers_count,
              forks_count,
              topics,
              license_name,
              readme_content,
              languages
            ),
            analysis_results(
              id,
              analysis_type_id,
              title,
              summary_description,
              overall_score,
              analysis_payload,
              analysis_type:analysis_types(
                name,
                slug
              )
            )
          )
        `,
        )
        .eq('user_id', user.id)
        .eq('status', 'saved');

      if (savedError) {
        throw savedError;
      }

      if (!savedRecords || savedRecords.length === 0) {
        setSavedIdeas([]);
        setSavedIdeaIds(new Set());
        setLoading(false);
        return;
      }

      // Transform the data and update state
      const transformedIdeas: IdeaData[] = savedRecords.map((record) => {
        // The 'idea' property contains the full idea object
        const ideaData = convertIdeaToIdeaData(record.idea);
        return {
          ...ideaData,
          notes: record.notes, // Include notes from the saved record
          isSaved: true,
        };
      });

      const ideaIds = savedRecords.map((record) => record.idea_id);

      setSavedIdeas(transformedIdeas);
      setSavedIdeaIds(new Set(ideaIds));
    } catch (err) {
      console.error('Error fetching saved ideas:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch saved ideas',
      );
    } finally {
      setLoading(false);
    }
  };

  // Save an idea
  const saveIdea = async (ideaId: string, notes?: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase.from('user_saved_ideas').insert({
        user_id: user.id,
        idea_id: ideaId,
        notes: notes || null,
        status: 'saved',
      });

      if (error) {
        throw error;
      }

      // Update local state
      setSavedIdeaIds((prev) => new Set([...prev, ideaId]));

      // Refresh saved ideas if we're on the saved ideas page
      if (savedIdeas.length > 0) {
        await fetchSavedIdeas();
      }

      return true;
    } catch (err) {
      console.error('Error saving idea:', err);
      setError(err instanceof Error ? err.message : 'Failed to save idea');
      return false;
    }
  };

  // Unsave an idea
  const unsaveIdea = async (ideaId: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_saved_ideas')
        .delete()
        .eq('user_id', user.id)
        .eq('idea_id', ideaId);

      if (error) {
        throw error;
      }

      // Update local state
      setSavedIdeaIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });

      // Remove from saved ideas list
      setSavedIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));

      return true;
    } catch (err) {
      console.error('Error unsaving idea:', err);
      setError(err instanceof Error ? err.message : 'Failed to unsave idea');
      return false;
    }
  };

  // Toggle save/unsave
  const toggleSaveIdea = async (
    ideaId: string,
    notes?: string,
  ): Promise<boolean> => {
    if (savedIdeaIds.has(ideaId)) {
      return await unsaveIdea(ideaId);
    } else {
      return await saveIdea(ideaId, notes);
    }
  };

  // Check if an idea is saved
  const isIdeaSaved = (ideaId: string): boolean => {
    return savedIdeaIds.has(ideaId);
  };

  // Update notes for a saved idea
  const updateSavedIdeaNotes = async (
    ideaId: string,
    notes: string,
  ): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_saved_ideas')
        .update({ notes })
        .eq('user_id', user.id)
        .eq('idea_id', ideaId);

      if (error) {
        throw error;
      }

      // Update local state
      setSavedIdeas((prev) =>
        prev.map((idea) => (idea.id === ideaId ? { ...idea, notes } : idea)),
      );

      return true;
    } catch (err) {
      console.error('Error updating saved idea notes:', err);
      setError(err instanceof Error ? err.message : 'Failed to update notes');
      return false;
    }
  };

  // Load saved ideas when user changes
  useEffect(() => {
    fetchSavedIdeas();
  }, [user]);

  return {
    savedIdeas,
    savedIdeaIds,
    loading,
    error,
    saveIdea,
    unsaveIdea,
    toggleSaveIdea,
    isIdeaSaved,
    updateSavedIdeaNotes,
    fetchSavedIdeas,
  };
};
