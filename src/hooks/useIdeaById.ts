import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { IdeaData } from '../types';
import { convertIdeaToIdeaData } from './useIdeas';

export function useIdeaById(id?: string, repositoryFullName?: string) {
  const [idea, setIdea] = useState<IdeaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id && !repositoryFullName) {
      setLoading(false);
      setError('No idea ID or repository name provided');
      return;
    }

    setLoading(true);
    setError(null);

    const fetchIdea = async () => {
      try {
        let ideaData;
        let repositoryId;
        
        if (id) {
          // Fetch idea by ID
          const { data: ideaResult, error: ideaError } = await supabase
            .from('ideas')
            .select(`
              *,
              repository:repositories(
                id,
                full_name,
                description,
                stargazers_count,
                forks_count,
                watchers_count,
                open_issues_count,
                topics,
                license_name,
                readme_content,
                languages,
                created_at_github,
                last_commit_at
              )
            `)
            .eq('id', id)
            .single();

          if (ideaError) {
            if (ideaError.code === 'PGRST116') {
              throw new Error('Idea not found');
            } else {
              throw ideaError;
            }
          }

          ideaData = ideaResult;
          repositoryId = ideaData.repository_id;
        } else if (repositoryFullName) {
          // First get the repository by full_name
          const { data: repoData, error: repoError } = await supabase
            .from('repositories')
            .select('id, full_name')
            .eq('full_name', repositoryFullName)
            .single();
            
          if (repoError) {
            throw new Error(`Repository not found: ${repositoryFullName}`);
          }
          
          repositoryId = repoData.id;
          
          // Then fetch the idea by repository_id
          const { data: ideaResult, error: ideaError } = await supabase
            .from('ideas')
            .select(`
              *,
              repository:repositories(
                id,
                full_name,
                description,
                stargazers_count,
                forks_count,
                watchers_count,
                open_issues_count,
                topics,
                license_name,
                readme_content,
                languages,
                created_at_github,
                last_commit_at
              )
            `)
            .eq('repository_id', repositoryId)
            .single();

          if (ideaError) {
            if (ideaError.code === 'PGRST116') {
              throw new Error(`No idea found for repository: ${repositoryFullName}`);
            } else {
              throw ideaError;
            }
          }

          ideaData = ideaResult;
        }

        if (!ideaData) {
          throw new Error('No idea found');
        }

        // Now fetch ALL analysis results related to this idea or repository
        const { data: analysisResults, error: analysisError } = await supabase
          .from('analysis_results')
          .select(`
            id,
            analysis_type_id,
            title,
            summary_description,
            overall_score,
            analysis_payload,
            generated_at,
            analysis_type:analysis_types(
              id,
              name,
              slug,
              description
            )
          `)
          .or(`idea_id.eq.${ideaData.id},repository_id.eq.${repositoryId}`);

        if (analysisError) {
          console.error('Error fetching analysis results:', analysisError);
          // Don't throw here, we can still show the idea without analysis
        }

        // Deduplicate analysis results by analysis_type_id
        // For each type, keep only the most recent one
        const deduplicatedAnalysisResults = [];
        const analysisTypeMap = new Map();

        if (analysisResults) {
          // First sort by generated_at (most recent first)
          const sortedResults = [...analysisResults].sort((a, b) => {
            // Handle null generated_at values
            if (!a.generated_at && !b.generated_at) return 0;
            if (!a.generated_at) return 1;
            if (!b.generated_at) return -1;
            
            // Sort by most recent first
            return new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime();
          });

          // Keep only the first (most recent) result for each analysis_type_id
          for (const result of sortedResults) {
            if (!analysisTypeMap.has(result.analysis_type_id)) {
              analysisTypeMap.set(result.analysis_type_id, result);
              deduplicatedAnalysisResults.push(result);
            }
          }
        }

        // Convert the database idea to IdeaData format
        const convertedIdea = convertIdeaToIdeaData(ideaData);
        
        // Add the deduplicated analysis results
        convertedIdea.analysisResults = deduplicatedAnalysisResults;
        
        setIdea(convertedIdea);
      } catch (err) {
        console.error('Error fetching idea:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch idea');
        setIdea(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id, repositoryFullName]);

  return { idea, loading, error };
}