import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { IdeaData } from '../types';
import { convertIdeaToIdeaData } from './useIdeas';

interface AnalysisResult {
  id: string;
  analysis_type_id: number;
  title: string;
  summary_description: string | null;
  overall_score: number | null;
  analysis_payload: any;
  analysis_type?: {
    name: string;
    slug: string;
  };
}

export function useIdeaById(id: string | undefined) {
  const [idea, setIdea] = useState<IdeaData & { analysisResults?: AnalysisResult[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('No idea ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    const fetchIdea = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('ideas')
          .select(
            `
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
          `,
          )
          .eq('id', id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Idea not found');
          } else {
            setError(fetchError.message);
          }
          setIdea(null);
        } else if (data) {
          // Convert the database idea to IdeaData format
          const ideaData = convertIdeaToIdeaData(data);
          
          // Add analysis results to the idea data
          setIdea({
            ...ideaData,
            analysisResults: data.analysis_results
          });
        } else {
          setError('No idea found');
          setIdea(null);
        }
      } catch (err) {
        console.error('Error fetching idea:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch idea');
        setIdea(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  return { idea, loading, error };
}