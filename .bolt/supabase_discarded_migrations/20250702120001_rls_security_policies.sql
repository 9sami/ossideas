/*
  # Row Level Security (RLS) Policies

  This migration enables RLS on all tables and creates security policies to ensure:
  1. Users can only access their own data
  2. Public read access to repositories and ideas (with premium restrictions)
  3. Proper authorization for user-specific operations
  4. Admin access for system operations (including n8n/AI agents via service_role)
*/

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_liked_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submitted_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferred_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE errors ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (for new registrations)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- REPOSITORIES TABLE POLICIES
-- ============================================================================

-- Only system/admin can update repositories (for data updates)
CREATE POLICY "System can manage repositories" ON repositories
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- IDEAS TABLE POLICIES
-- ============================================================================

-- All users can read published ideas (no premium restriction)
CREATE POLICY "All users can read published ideas" ON ideas
  FOR SELECT USING (status = 'published');

-- System can manage all ideas
CREATE POLICY "System can manage ideas" ON ideas
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- ANALYSIS RESULTS TABLE POLICIES
-- ============================================================================

-- All users can read analysis results for published ideas (no premium restriction)
CREATE POLICY "All users can read analysis results for published ideas" ON analysis_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ideas i 
      WHERE i.id = analysis_results.idea_id 
      AND i.status = 'published'
    )
  );

-- Curators can update analysis results they curated
CREATE POLICY "Curators can update their analysis results" ON analysis_results
  FOR UPDATE USING (curated_by_user_id = auth.uid());

-- System can manage all analysis results
CREATE POLICY "System can manage analysis results" ON analysis_results
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- ERRORS TABLE POLICIES
-- ============================================================================

-- System can manage errors
CREATE POLICY "System can manage errors" ON errors
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- USER SAVED IDEAS TABLE POLICIES
-- ============================================================================

-- Users can only access their own saved ideas
CREATE POLICY "Users can manage own saved ideas" ON user_saved_ideas
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- USER LIKED IDEAS TABLE POLICIES
-- ============================================================================

-- Users can only access their own liked ideas
CREATE POLICY "Users can manage own liked ideas" ON user_liked_ideas
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- ============================================================================

-- Users can only access their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- System can manage all subscriptions (for webhook updates)
CREATE POLICY "System can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- SUBMITTED REPOSITORIES TABLE POLICIES
-- ============================================================================

-- Only users can read their own submitted repositories
CREATE POLICY "Users can read own submitted repositories" ON submitted_repositories
  FOR SELECT USING (user_id = auth.uid());

-- Only users can manage their own submitted repositories
CREATE POLICY "Users can manage own submitted repositories" ON submitted_repositories
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- EMAIL DIGESTS TABLE POLICIES
-- ============================================================================

-- System can manage email digests
CREATE POLICY "System can manage email digests" ON email_digests
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- CATEGORIES TABLE POLICIES
-- ============================================================================

-- Public read access to categories
CREATE POLICY "Public read access to categories" ON categories
  FOR SELECT USING (true);

-- System can manage categories
CREATE POLICY "System can manage categories" ON categories
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- LANGUAGES TABLE POLICIES
-- ============================================================================

-- Public read access to languages
CREATE POLICY "Public read access to languages" ON languages
  FOR SELECT USING (true);

-- System can manage languages
CREATE POLICY "System can manage languages" ON languages
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- INDUSTRIES TABLE POLICIES
-- ============================================================================

-- Public read access to industries
CREATE POLICY "Public read access to industries" ON industries
  FOR SELECT USING (true);

-- System can manage industries
CREATE POLICY "System can manage industries" ON industries
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- ANALYSIS TYPES TABLE POLICIES
-- ============================================================================

-- System can manage analysis types
CREATE POLICY "System can manage analysis types" ON analysis_types
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- REPOSITORY CATEGORIES TABLE POLICIES
-- ============================================================================

-- Public read access to repository categories
CREATE POLICY "Public read access to repository categories" ON repository_categories
  FOR SELECT USING (true);

-- System can manage repository categories
CREATE POLICY "System can manage repository categories" ON repository_categories
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- REPOSITORY LANGUAGES TABLE POLICIES
-- ============================================================================

-- Public read access to repository languages
CREATE POLICY "Public read access to repository languages" ON repository_languages
  FOR SELECT USING (true);

-- System can manage repository languages
CREATE POLICY "System can manage repository languages" ON repository_languages
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- USER CATEGORIES TABLE POLICIES
-- ============================================================================

-- Users can only access their own category preferences
CREATE POLICY "Users can manage own category preferences" ON user_categories
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- USER PREFERRED LANGUAGES TABLE POLICIES
-- ============================================================================

-- Users can only access their own language preferences
CREATE POLICY "Users can manage own language preferences" ON user_preferred_languages
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- USER INDUSTRIES TABLE POLICIES
-- ============================================================================

-- Users can only access their own industry preferences
CREATE POLICY "Users can manage own industry preferences" ON user_industries
  FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- DIGEST IDEAS TABLE POLICIES
-- ============================================================================

-- System can manage digest ideas
CREATE POLICY "System can manage digest ideas" ON digest_ideas
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- (All premium logic is now removed; all users have access to ideas and analysis) 