# OSSIdeas Project Guide for AI Development

## Project Overview

OSSIdeas is a platform for discovering startup opportunities based on open source projects. The platform analyzes GitHub repositories and generates business ideas using AI.

## Core Technologies

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- Lucide React icons

### Backend
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Supabase Auth
- Supabase Edge Functions

### Payments
- Stripe integration
- Stripe Checkout
- Stripe Webhooks

## AI Agent Workflow

### Key Agents
- **RepositoryFilterAgent**: Filters out repositories without business potential
- **RepositoryRankAgent**: Scores repositories for business opportunity
- **TunerAgent**: Generates AI parameter configurations
- **TunedOpportunityAgent**: Creates opportunity summaries
- **IdeaAgent**: Synthesizes business ideas

### Workflow Orchestration
- n8n orchestrates the AI pipeline
- Repositories flow through five sequential agents
- See `prompts/MAIN_WORKFLOW.md` for detailed flow

## Key React Hooks

### Custom Hooks
- **useAuth**: User authentication state management
- **useIdeas**: Fetches and manages startup ideas
- **useRepositories**: Handles GitHub repository data
- **useSavedIdeas**: Manages user's saved ideas
- **useSubmissions**: Handles repository submissions
- **useSubscriptionManagement**: Manages Stripe subscriptions

## Database Schema Guidelines

### Migration Naming
- Format: `YYYYMMDDHHMMSS_descriptive_name.sql`

### Key Tables
- **profiles**: User profile data
- **repositories**: GitHub repository information
- **ideas**: AI-generated business ideas
- **analysis_results**: Detailed analysis components
- **subscriptions**: Stripe subscription data

### Database Functions
- **get_repositories(has, has_not, limit_count)**: Advanced repository filtering

## Development Standards

### Code Organization
- Organize by feature/component type
- Keep components under 300 lines
- Extract complex logic into custom hooks
- Use TypeScript interfaces for all data structures

### Database Operations
- Enable RLS on user data tables
- Add indexes for frequently queried columns
- Use descriptive migration names
- Document complex structures

### UI/UX Standards
- Mobile-first responsive design
- Appropriate loading indicators
- Graceful error handling
- Accessibility considerations

## Authentication & Authorization

### User Flow
1. Registration via email/password or Google OAuth
2. Email verification (for email/password)
3. Onboarding to collect preferences
4. Profile management

### Security
- RLS policies for data protection
- Service role for admin tasks
- JWT token management via Supabase

## Subscription Management

### Stripe Integration
- Basic and Pro plans (monthly/yearly)
- Webhooks for subscription lifecycle
- Real-time UI updates

## Error Handling & Logging

### Error Management
- Centralized logging in `errors` table
- User-friendly error messages
- Graceful degradation

## Continuous Learning

When working on this project:

1. Update documentation after significant changes
2. Document new patterns and conventions
3. Track successful optimizations
4. Document bug prevention strategies

## Quality Assurance

### Testing Strategy
- Verify user flows
- Test database migrations
- Test Stripe webhooks
- Monitor performance

## Deployment Process

### Frontend (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`

### Backend (Supabase)
- Database migrations
- Edge functions
- Environment variables