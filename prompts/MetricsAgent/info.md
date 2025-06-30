# MetricsAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o or Claude-3-Sonnet
- **Reasoning**: Complex business analysis requiring high-quality reasoning and strategic thinking

### Parameters
- **Temperature**: 0.3
  - Low temperature for consistent, practical metric recommendations
- **Top P**: 0.7
  - Balanced sampling for business-focused outputs
- **Top K**: 40
  - Moderate token selection for consistent metric generation
- **Max Tokens**: 800
  - Sufficient for comprehensive metrics framework

### Safety Settings
- **Harm Categories**: Standard filtering
- **Block Threshold**: BLOCK_MEDIUM_AND_ABOVE
- **Rationale**: Standard safety for business content

## Performance Characteristics

### Expected Response Time
- **Target**: < 8 seconds
- **Typical**: 3-6 seconds

### Quality Metrics
- **Metric Relevance**: > 90% business-appropriate metrics
- **Target Realism**: > 85% achievable targets
- **Framework Completeness**: > 95% coverage of key business areas

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
- Metric count validation (2-5 metrics per category)
- Importance distribution check

### Monitoring Metrics
- Metric type distribution
- Importance level distribution
- Processing success rate
- Target specificity assessment