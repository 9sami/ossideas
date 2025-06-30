# RiskAnalysisAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o or Claude-3-Sonnet
- **Reasoning**: Complex risk analysis requiring high-quality reasoning and strategic thinking

### Parameters
- **Temperature**: 0.4
  - Moderate temperature for creative yet grounded risk identification
- **Top P**: 0.8
  - Balanced sampling for risk assessment outputs
- **Top K**: 50
  - Moderate token selection for diverse risk identification
- **Max Tokens**: 800
  - Sufficient for comprehensive risk analysis

### Safety Settings
- **Harm Categories**: Standard filtering
- **Block Threshold**: BLOCK_MEDIUM_AND_ABOVE
- **Rationale**: Standard safety for business content

## Performance Characteristics

### Expected Response Time
- **Target**: < 8 seconds
- **Typical**: 3-6 seconds

### Quality Metrics
- **Risk Relevance**: > 90% business-specific risks
- **Mitigation Practicality**: > 85% actionable strategies
- **Risk Coverage**: > 90% coverage of key risk categories

## Cost Optimization

### Token Usage
- **Input Tokens**: ~800-1200 per idea
- **Output Tokens**: ~400-600 per idea
- **Cost per 1000 ideas**: ~$10-15 (GPT-4o)

### Batch Processing
- **Recommended Batch Size**: 10-15 ideas
- **Parallel Processing**: Up to 3 concurrent requests
- **Rate Limiting**: Standard API limits

## Quality Assurance

### Validation Checks
- JSON schema validation
- Required field completeness
- Risk count validation (3-5 risks)
- Impact/probability distribution check

### Monitoring Metrics
- Risk category distribution
- Impact/probability distribution
- Processing success rate
- Mitigation strategy quality assessment