/*
  # Add foreign key: user_saved_ideas.idea_id -> ideas.id
*/
ALTER TABLE user_saved_ideas
  ADD CONSTRAINT fk_user_saved_ideas_idea_id FOREIGN KEY (idea_id)
    REFERENCES ideas(id); 