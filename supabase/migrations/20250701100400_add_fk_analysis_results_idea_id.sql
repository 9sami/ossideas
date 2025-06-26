/*
  # Add foreign key: analysis_results.idea_id -> ideas.id
*/
ALTER TABLE analysis_results
  ADD CONSTRAINT fk_analysis_results_idea_id FOREIGN KEY (idea_id)
    REFERENCES ideas(id); 