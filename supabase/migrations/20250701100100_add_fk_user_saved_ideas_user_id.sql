/*
  # Add foreign key: user_saved_ideas.user_id -> users.id
*/
ALTER TABLE user_saved_ideas
  ADD CONSTRAINT fk_user_saved_ideas_user_id FOREIGN KEY (user_id)
    REFERENCES users(id); 
 