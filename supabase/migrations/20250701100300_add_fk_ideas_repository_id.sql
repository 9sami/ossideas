/*
  # Add foreign key: ideas.repository_id -> repositories.id
*/
ALTER TABLE ideas
  ADD CONSTRAINT fk_ideas_repository_id FOREIGN KEY (repository_id)
    REFERENCES repositories(id); 