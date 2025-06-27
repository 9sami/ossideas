/*
  # Replace users table with profiles and update all relationships

  1. Update all user_id foreign keys to reference profiles(id) instead of users(id)
  2. Drop the users table
*/

-- 1. Drop existing foreign keys referencing users(id)
ALTER TABLE user_saved_ideas DROP CONSTRAINT IF EXISTS fk_user_saved_ideas_user_id;
ALTER TABLE user_liked_ideas DROP CONSTRAINT IF EXISTS user_liked_ideas_user_id_fkey;
ALTER TABLE user_categories DROP CONSTRAINT IF EXISTS user_categories_user_id_fkey;
ALTER TABLE user_preferred_languages DROP CONSTRAINT IF EXISTS user_preferred_languages_user_id_fkey;
ALTER TABLE user_industries DROP CONSTRAINT IF EXISTS user_industries_user_id_fkey;
ALTER TABLE submitted_repositories DROP CONSTRAINT IF EXISTS submitted_repositories_user_id_fkey;
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

-- 2. Add new foreign keys referencing profiles(id)
ALTER TABLE user_saved_ideas ADD CONSTRAINT fk_user_saved_ideas_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE user_liked_ideas ADD CONSTRAINT fk_user_liked_ideas_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE user_categories ADD CONSTRAINT fk_user_categories_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE user_preferred_languages ADD CONSTRAINT fk_user_preferred_languages_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE user_industries ADD CONSTRAINT fk_user_industries_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE submitted_repositories ADD CONSTRAINT fk_submitted_repositories_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. Drop the users table
DROP TABLE IF EXISTS users; 