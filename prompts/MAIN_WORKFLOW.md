# OSSIdeas AI Agent Workflow

## Overview

The OSSIdeas platform uses a sophisticated AI pipeline to transform GitHub repositories into actionable business opportunities. This workflow is orchestrated by n8n and involves multiple specialized AI agents working in sequence.

## Workflow Architecture

```
GitHub Repository → RepositoryFilterAgent → RepositoryRankAgent → TunerAgent → TunedOpportunityAgent → IdeaAgent → Analysis Agents → Database
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
**Database Impact**: Creates records in `analysis_results` table with `analysis_type_id = 39`

### 5. IdeaAgent
**Purpose**: Synthesizes multiple opportunities into a single cohesive business idea
**Input**: Repository + multiple opportunity summaries
**Output**: Final business idea with structured data including title and tagline
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `ideas` table and `analysis_results` table with `analysis_type_id = 1`

### 6. Specialized Analysis Agents (Proposed)
These agents generate detailed analysis components for each business idea:

#### 6.1 MVPFeaturesAgent
**Purpose**: Identifies minimal viable product features
**Input**: Repository data + idea overview
**Output**: 3-5 user-centric core features
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `analysis_results` table with `analysis_type_id = 3`

#### 6.2 ActionItemsAgent
**Purpose**: Creates practical next steps for implementation
**Input**: Repository data + idea overview + core features
**Output**: Checklist of 3-5 immediate, tangible tasks
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `analysis_results` table with `analysis_type_id = 4`

#### 6.3 CompetitiveAnalysisAgent
**Purpose**: Analyzes competitive landscape and advantages
**Input**: Repository data + idea overview
**Output**: Direct/indirect competitors and unique value proposition
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `analysis_results` table with `analysis_type_id = 5`

#### 6.4 MonetizationStrategyAgent
**Purpose**: Develops business models and pricing strategies
**Input**: Repository data + idea overview + competitive analysis
**Output**: Pricing tiers, value metric, and key features per tier
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `analysis_results` table with `analysis_type_id = 6`

#### 6.5 TechStackAgent
**Purpose**: Recommends technical architecture and implementation workflow
**Input**: Repository data + core features
**Output**: Core components and high-level workflow
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `analysis_results` table with `analysis_type_id = 7`

#### 6.6 MetricsAgent
**Purpose**: Defines success metrics and KPIs
**Input**: Repository data + idea overview + monetization strategy
**Output**: Top-of-funnel, activation, and business metrics
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `analysis_results` table with `analysis_type_id = 8`

#### 6.7 RiskAnalysisAgent
**Purpose**: Identifies potential risks and mitigation strategies
**Input**: Repository data + idea overview + competitive analysis
**Output**: Risk assessment and countermeasures
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `analysis_results` table with `analysis_type_id = 9`

#### 6.8 GoToMarketAgent
**Purpose**: Develops launch strategy and marketing plan
**Input**: Repository data + idea overview + target market
**Output**: Launch channels and compelling hook
**Processing**: Executed in n8n workflow
**Database Impact**: Creates record in `analysis_results` table with `analysis_type_id = 10`

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
6. **Detailed Analysis**: Generate specialized analysis components

### Output Destinations
- `repositories` table (filtering results, scores)
- `analysis_results` table (opportunity summaries, specialized analyses)
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
1. **Idea Title & Tagline** (ID: 1) - 15% importance
2. **Opportunity Summary** (ID: 2) - 15% importance
3. **MVP Core Features** (ID: 3) - 15% importance
4. **Next Steps / Action Items** (ID: 4) - 10% importance
5. **Competitive Analysis** (ID: 5) - 10% importance
6. **Monetization Strategy** (ID: 6) - 10% importance
7. **Technical Stack & Workflow** (ID: 7) - 10% importance
8. **Success Metrics & KPIs** (ID: 8) - 5% importance
9. **Risks & Mitigations** (ID: 9) - 5% importance
10. **Go-to-Market Plan** (ID: 10) - 5% importance
11. **Market Analysis** (ID: 11) - 4% importance
12. **Target Market Analysis** (ID: 12) - 4% importance
13. **SWOT Analysis** (ID: 13) - 4% importance
14. **Financial Analysis** (ID: 14) - 3% importance
15. **PESTEL Analysis** (ID: 15) - 3% importance
16. **Market Trend Analysis** (ID: 16) - 3% importance
17. **Strategic Frameworks** (ID: 17) - 3% importance
18. **GAP Analysis** (ID: 18) - 3% importance
19. **Product Analysis** (ID: 19) - 3% importance
20. **Customer Analysis** (ID: 20) - 3% importance
21. **Operational Analysis** (ID: 21) - 2% importance
22. **Data Analysis** (ID: 22) - 2% importance
23. **Product-Market Fit Analysis** (ID: 23) - 2% importance
24. **Ratio Analysis** (ID: 24) - 2% importance
25. **Trend Analysis** (ID: 25) - 2% importance
26. **Break-even Analysis** (ID: 26) - 2% importance
27. **Cost-Benefit Analysis** (ID: 27) - 2% importance
28. **Cash Flow Analysis** (ID: 28) - 2% importance
29. **Process Analysis** (ID: 29) - 1% importance
30. **Value Chain Analysis** (ID: 30) - 1% importance
31. **Capacity Analysis** (ID: 31) - 1% importance
32. **Workflow Analysis** (ID: 32) - 1% importance
33. **Bottleneck Analysis** (ID: 33) - 1% importance
34. **Customer Segmentation** (ID: 34) - 1% importance
35. **Customer Lifetime Value (CLV)** (ID: 35) - 1% importance
36. **Churn Analysis** (ID: 36) - 1% importance
37. **Customer Satisfaction (CSAT) Analysis** (ID: 37) - 1% importance
38. **Net Promoter Score (NPS) Analysis** (ID: 38) - 1% importance
39. **Opportunity Analysis** (ID: 39) - 4% importance
40. **Repository Evaluation** (ID: 40) - 3% importance

### Frontend Integration
The frontend dynamically renders analysis results based on:
- `analysis_type_id`: Determines component type to render
- `analysis_payload`: Contains structured JSON data for display
- Analysis components are designed to handle varied output structures

## Dependencies

### AI Models
- **Primary Models**: GPT-4o, Claude-3-Sonnet
- **Efficiency Models**: GPT-4o-mini, Claude-3-Haiku
- **Specialized Models**: Gemini-2.5-Pro, Gemini-2.5-Flash

### External APIs
- **GitHub API**: Repository data retrieval
- **Tavily Search API**: Market research and validation
- **Stripe API**: Payment processing

### Development Dependencies
- **n8n**: Workflow orchestration
- **Supabase**: Database and authentication
- **React**: Frontend framework
- **TypeScript**: Type safety
- **Tailwind CSS**: UI styling

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

## Implementation Strategy

### Phase 1: Core Pipeline (Implemented)
- RepositoryFilterAgent
- RepositoryRankAgent
- TunerAgent
- TunedOpportunityAgent
- IdeaAgent with Title & Tagline generation

### Phase 2: Primary Analysis Agents (Proposed)
- MVPFeaturesAgent
- ActionItemsAgent
- CompetitiveAnalysisAgent
- MonetizationStrategyAgent

### Phase 3: Secondary Analysis Agents (Proposed)
- TechStackAgent
- MetricsAgent
- RiskAnalysisAgent
- GoToMarketAgent

### Phase 4: Advanced Analysis Agents (Future)
- Financial analysis agents
- Customer analysis agents
- Operational analysis agents

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