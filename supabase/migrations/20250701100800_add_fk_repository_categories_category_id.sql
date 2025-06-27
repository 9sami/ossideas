/*
  # Add foreign key: repository_categories.category_id -> categories.id
*/
ALTER TABLE repository_categories
  ADD CONSTRAINT fk_repository_categories_category_id FOREIGN KEY (category_id)
    REFERENCES categories(id); 