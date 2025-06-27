/*
  # Add foreign key: repository_categories.repository_id -> repositories.id
*/
ALTER TABLE repository_categories
  ADD CONSTRAINT fk_repository_categories_repository_id FOREIGN KEY (repository_id)
    REFERENCES repositories(id); 