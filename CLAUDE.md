# OSSIdeas Project Guide for AI Development

## Project Overview

OSSIdeas is a comprehensive platform for discovering startup opportunities based on open source projects. The platform analyzes GitHub repositories and generates business ideas, monetization strategies, and market insights using AI.

## Core Technologies

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** as build tool and dev server
- **React Router DOM** for client-side routing
- **Lucide React** for icons

### Backend & Database
- **Supabase** (PostgreSQL with real-time features)
- **Row Level Security (RLS)** for data protection
- **Supabase Auth** for user authentication
- **Supabase Edge Functions** for serverless logic

### Payment Processing
- **Stripe** for subscription management
- **Stripe Checkout** for payment processing
- **Stripe Webhooks** for real-time updates

### Deployment
- **Netlify** for frontend hosting
- **Supabase** for backend infrastructure

## Key React Hooks Used

### Custom Hooks
- **`useAuth`** - Manages user authentication state, login/logout, and user data
- **`useIdeas`** - Fetches and manages startup ideas with filtering and pagination
- **`useRepositories`** - Handles GitHub repository data with specialized variants:
  - `useNewRepositories` - Recently created repositories
  - `useTrendingRepositories` - Popular repositories with recent activity
  - `useCommunityPickRepositories` - High-engagement repositories
- **`useRepositoryById`** - Fetches individual repository details
- **`useIdeaById`** - Fetches individual idea details
- **`useSavedIdeas`** - Manages user's saved ideas functionality
- **`useSubmissions`** - Handles user repository submissions
- **`useSubscriptionManagement`** - Manages Stripe subscription operations

### Built-in React Hooks
- **`useState`** - Local component state management
- **`useEffect`** - Side effects and lifecycle management
- **`useCallback`** - Memoizing functions to prevent unnecessary re-renders
- **`useMemo`** - Memoizing computed values for performance
- **`useRef`** - DOM references and infinite scroll observers
- **`useNavigate`** - Programmatic navigation (React Router)
- **`useParams`** - URL parameter extraction (React Router)
- **`useLocation`** - Current route information (React Router)

## Database Schema Guidelines

### Migration Naming Convention
- **Format**: `YYYYMMDDHHMMSS_descriptive_name.sql`
- **Examples**:
  - `20250629015516_add_repository_id_to_analysis_results.sql`
  - `20250629023025_create_errors_table.sql`
  - `20250629062437_add_skipped_fields_to_repositories.sql`
  - `20250629092849_create_get_repositories_function.sql`

### Key Tables
- **`profiles`** - User profile data (extends Supabase auth.users)
- **`repositories`** - GitHub repository information
- **`ideas`** - AI-generated business ideas
- **`analysis_results`** - Detailed analysis components for ideas
- **`subscriptions`** - Stripe subscription data
- **`user_saved_ideas`** - User's bookmarked ideas

### Database Functions
- **`get_repositories(has, has_not, limit_count)`** - Advanced repository filtering function
  - **Purpose**: Filters repositories based on presence/absence of analysis results
  - **Parameters**:
    - `has` (int[]): Analysis type IDs that repositories MUST have
    - `has_not` (int[]): Analysis type IDs that repositories MUST NOT have  
    - `limit_count` (integer): Optional limit on number of results
  - **Use Cases**:
    - Find repositories with no analysis results: `SELECT * FROM get_repositories()`
    - Find repositories with specific analysis types: `SELECT * FROM get_repositories(ARRAY[1,2])`
    - Find repositories without certain analysis types: `SELECT * FROM get_repositories(NULL, ARRAY[3,4])`
    - Complex filtering with limits: `SELECT * FROM get_repositories(ARRAY[1], ARRAY[2], 10)`

### Foreign Key Relationships
- All user-related tables reference `profiles(id)`
- `ideas` references `repositories(id)`
- `analysis_results` can reference both `ideas(id)` and `repositories(id)`
- Cascade deletes are used appropriately to maintain data integrity

## Development Standards

### Code Organization
- **File Structure**: Organize by feature/component type
- **Component Size**: Keep components under 300 lines, split when necessary
- **Hook Separation**: Extract complex logic into custom hooks
- **Type Safety**: Use TypeScript interfaces for all data structures

### Database Operations
- **RLS Policies**: Always enable Row Level Security on user data tables
- **Indexes**: Add indexes for frequently queried columns
- **Migrations**: Use descriptive names that reflect the actual changes
- **Comments**: Document complex database structures and constraints
- **Functions**: Use PL/pgSQL functions for complex filtering and business logic

### UI/UX Standards
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Loading States**: Show appropriate loading indicators
- **Error Handling**: Graceful error messages and fallbacks
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Performance Optimization
- **Infinite Scroll**: Implement for large data sets
- **Memoization**: Use `useMemo` and `useCallback` for expensive operations
- **Code Splitting**: Lazy load routes and components when beneficial
- **Image Optimization**: Use appropriate formats and sizes
- **Database Functions**: Use server-side functions for complex queries

## Authentication & Authorization

### User Flow
1. **Registration**: Email/password or Google OAuth
2. **Email Verification**: Required for email/password signups
3. **Onboarding**: Collect user preferences and industry interests
4. **Profile Management**: Users can update their information

### Security Measures
- **RLS Policies**: Ensure users can only access their own data
- **Service Role**: Used for webhook operations and admin tasks
- **JWT Tokens**: Supabase handles token management automatically

## Subscription Management

### Stripe Integration
- **Products**: Basic and Pro plans with monthly/yearly options
- **Webhooks**: Handle subscription lifecycle events
- **Real-time Updates**: Subscription changes reflect immediately in UI

### Database Sync
- **Webhook Processing**: Stripe events update local subscription data
- **Fallback Mechanisms**: Manual database updates when webhooks fail
- **Conflict Resolution**: Prevent duplicate active subscriptions

## Error Handling & Logging

### Error Management
- **Centralized Logging**: Use `errors` table for system-wide error tracking
- **User-Friendly Messages**: Show helpful error messages to users
- **Graceful Degradation**: Provide fallbacks when services are unavailable

### Debugging Tools
- **Supabase Logs**: Monitor edge function execution
- **Browser DevTools**: Client-side debugging and network inspection
- **Database Queries**: Use Supabase dashboard for data inspection

## Continuous Learning & Self-Correction

### AI Development Guidelines

When working on this project, the AI should continuously learn and adapt by:

1. **Post-Task Documentation Updates**
   - After completing any significant feature or fix, evaluate if `CLAUDE.md` needs updates
   - Add new patterns, conventions, or lessons learned to this guide
   - Update technology stack information when new tools are introduced
   - Document new hooks or architectural patterns that emerge

2. **Pattern Recognition**
   - Identify recurring issues and document solutions
   - Note successful architectural decisions for future reference
   - Track performance optimizations that work well
   - Document common pitfalls and how to avoid them

3. **Knowledge Accumulation**
   - When encountering new Supabase features, document usage patterns
   - Record Stripe integration lessons and best practices
   - Note React performance optimizations that prove effective
   - Document successful database schema evolution strategies

4. **Self-Correction Mechanisms**
   - When fixing bugs, analyze root causes and update guidelines to prevent recurrence
   - Review and refine naming conventions based on actual usage
   - Update code organization principles based on what works in practice
   - Revise development workflows when better approaches are discovered

### Update Trigger Phrases

After completing tasks involving:
- **New database migrations** → Update migration naming examples
- **New custom hooks** → Add to hooks documentation
- **New Stripe functionality** → Update payment processing section
- **Performance improvements** → Document optimization techniques
- **Bug fixes** → Add prevention guidelines
- **New UI patterns** → Update design standards
- **Authentication changes** → Update security measures
- **Database schema changes** → Update schema guidelines
- **Database functions** → Update database functions documentation

### Learning Prompts

When finishing any development task, ask:
1. "Should this pattern be documented in CLAUDE.md for future reference?"
2. "Did this task reveal any gaps in our current guidelines?"
3. "Are there new conventions or standards that emerged from this work?"
4. "What lessons learned should be captured for the next developer?"

## Quality Assurance

### Testing Strategy
- **Manual Testing**: Verify all user flows work correctly
- **Database Testing**: Ensure migrations run without errors
- **Integration Testing**: Test Stripe webhooks and Supabase functions
- **Performance Testing**: Monitor loading times and responsiveness
- **Function Testing**: Verify database functions return expected results

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] RLS policies are correctly implemented
- [ ] Error handling is comprehensive
- [ ] Loading states are implemented
- [ ] Responsive design works on all devices
- [ ] Database migrations have descriptive names
- [ ] Custom hooks are properly memoized
- [ ] Security best practices are followed
- [ ] Database functions are documented and tested

## Deployment Process

### Frontend Deployment (Netlify)
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variables configured
4. Custom domain setup (if applicable)

### Backend Deployment (Supabase)
1. Database migrations applied
2. Edge functions deployed
3. Environment variables set
4. RLS policies enabled
5. Webhook endpoints configured

## Troubleshooting Common Issues

### Database Issues
- **Migration Conflicts**: Use descriptive names and check for dependencies
- **RLS Policy Errors**: Verify user authentication and policy conditions
- **Performance Issues**: Add appropriate indexes and optimize queries
- **Function Errors**: Check parameter types and return value expectations

### Authentication Issues
- **OAuth Callback Errors**: Check redirect URLs and environment variables
- **Session Management**: Ensure proper token handling and refresh logic
- **Permission Errors**: Verify RLS policies and user roles

### Stripe Integration Issues
- **Webhook Failures**: Check endpoint URLs and signature verification
- **Subscription Sync**: Monitor webhook logs and database updates
- **Payment Processing**: Verify price IDs and product configuration


---

*This guide should be updated regularly as the project evolves and new patterns emerge. Each significant development task should conclude with an evaluation of whether this documentation needs enhancement.*