# TunedOpportunityAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o or Claude-3-Sonnet
- **Reasoning**: Complex analysis requiring high-quality reasoning and market research

### Parameters
- **Temperature**: Variable (0.2-0.8)
  - Controlled by TunerAgent output
- **Top P**: Variable (0.3-0.9)
  - Controlled by TunerAgent output
- **Top K**: Variable (10-80)
  - Controlled by TunerAgent output
- **Max Tokens**: Variable (400-1200)
  - Controlled by TunerAgent output

### Safety Settings
- **Harm Categories**: Variable per TunerAgent
- **Block Threshold**: Variable per TunerAgent
- **Rationale**: Allows experimentation with safety levels

## Performance Characteristics

### Expected Response Time
- **Target**: < 15 seconds
- **Typical**: 5-12 seconds (includes Tavily searches)

### Quality Metrics
- **Market Research Accuracy**: > 85% factual accuracy
- **Opportunity Relevance**: > 90% relevance to repository
- **Business Viability**: > 80% realistic assessments

## Cost Optimization

### Token Usage
- **Input Tokens**: ~800-1500 per repository
- **Output Tokens**: ~600-1200 per repository
- **Tavily API Calls**: 2-4 per repository
- **Cost per 1000 repos**: ~$15-30 (GPT-4o)

### Batch Processing
- **Recommended Batch Size**: 5-10 repositories
- **Parallel Processing**: Up to 2 concurrent requests
- **Rate Limiting**: Conservative due to external API calls

## Quality Assurance

### Validation Checks
- JSON schema validation
- Required field completeness
- Market validation data presence
- Score range validation

### Monitoring Metrics
- Tavily search success rate
- Opportunity score distribution
- Processing success rate
- Market trend accuracy