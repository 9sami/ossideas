/*
  # Add foreign key: analysis_results.analysis_type_id -> analysis_types.id
*/
ALTER TABLE analysis_results
  ADD CONSTRAINT fk_analysis_results_analysis_type_id FOREIGN KEY (analysis_type_id)
    REFERENCES analysis_types(id); 