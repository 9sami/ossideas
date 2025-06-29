# OSSIdeas AI Agent Workflow

## Overview

The OSSIdeas platform uses a sophisticated AI pipeline to transform GitHub repositories into actionable business opportunities. This workflow is orchestrated by n8n and involves five specialized AI agents working in sequence.

## Workflow Architecture

```
GitHub Repository → RepositoryFilterAgent → RepositoryRankAgent → TunerAgent → TunedOpportunityAgent → IdeaAgent → Database
```

## Agent Pipeline

### 1. RepositoryFilterAgent
**Purpose**: Filters out unnecessary repositories and garbage content
**Input**: Raw GitHub repository data
**Output**: Skip decision with reasoning
**Processing**: Executed in n8n workflow
**Database Impact**: Updates `repositories.is_skipped` and `repositories.skip_note`

### 2. RepositoryRankAgent  
**Purpose**: Scores repositories for business opportunity potential
**Input**: Repository metadata (stars, forks, description, etc.)
**Output**: Weighted scores and total opportunity score (0-100)
**Processing**: Executed in n8n workflow
**Database Impact**: Stores scores in repository record

### 3. TunerAgent
**Purpose**: Generates multiple parameter configurations for opportunity generation
**Input**: Repository with scores
**Output**: N different AI parameter sets (temperature, top_k, etc.)
**Processing**: Executed in n8n workflow
**Database Impact**: Configurations used for next agent

### 4. TunedOpportunityAgent
**Purpose**: Generates opportunity summaries using tuned parameters
**Input**: Repository data + tuned parameters
**Output**: Multiple opportunity summaries with market validation
**Processing**: Executed in n8n workflow (multiple runs)
**Database Impact**: Creates records in `analysis_results` table

### 5. IdeaAgent
**Purpose**: Synthesizes multiple opportunities into a single cohesive business idea
**Input**: Repository + multiple opportunity summaries
**Output**: Final business idea with structured data
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `ideas` table

## Data Flow

### Input Sources
- GitHub API data (repository metadata)
- Tavily Search API (market research)
- Repository analysis scores

### Processing Stages
1. **Filtering**: Remove low-quality repositories
2. **Ranking**: Score business potential
3. **Tuning**: Generate parameter variations
4. **Opportunity Generation**: Create multiple opportunity summaries
5. **Idea Synthesis**: Combine into final business idea

### Output Destinations
- `repositories` table (filtering results, scores)
- `analysis_results` table (opportunity summaries)
- `ideas` table (final business ideas)
- `errors` table (processing failures)

## Database Schema Integration

### Key Tables
- **repositories**: Source data with filtering and scoring results
- **analysis_types**: Defines different types of analysis (opportunity, SWOT, etc.)
- **analysis_results**: Stores individual analysis components
- **ideas**: Final synthesized business opportunities

### Analysis Types
The system supports multiple analysis types through the `analysis_types` table:
- Opportunity Summary
- SWOT Analysis
- Market Analysis
- Technical Deep Dive
- Monetization Strategy
- Competitive Analysis

### Frontend Integration
The frontend dynamically renders analysis results based on:
- `analysis_type_id`: Determines component type to render
- `analysis_payload`: Contains structured JSON data for display
- Analysis components are designed to handle varied output structures

## Quality Control

### Error Handling
- Failed processing logged to `errors` table
- Retry mechanisms in n8n workflow
- Graceful degradation for partial failures

### Data Validation
- JSON schema validation for agent outputs
- Database constraints ensure data integrity
- RLS policies protect user data

### Performance Monitoring
- Processing time tracking
- Success/failure rate monitoring
- Queue management for high-volume processing

## Orchestration (n8n)

### Workflow Triggers
- New repository submissions
- Scheduled batch processing
- Manual processing requests

### Error Recovery
- Automatic retries for transient failures
- Dead letter queues for persistent failures
- Manual intervention workflows

### Scaling Considerations
- Parallel processing for independent operations
- Rate limiting for external APIs
- Resource allocation based on priority

## Future Enhancements

### Planned Improvements
- Additional analysis types
- Multi-language support
- Enhanced market research integration
- Real-time processing capabilities

### Extensibility
- Plugin architecture for new agents
- Configurable analysis pipelines
- Custom analysis types per user