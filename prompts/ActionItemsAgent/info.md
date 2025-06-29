# ActionItemsAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o or Claude-3-Sonnet
- **Reasoning**: Complex project planning requiring high-quality reasoning and strategic thinking

### Parameters
- **Temperature**: 0.3
  - Low temperature for consistent, practical action items
- **Top P**: 0.7
  - Balanced sampling for actionable outputs
- **Top K**: 40
  - Moderate token selection for consistent planning
- **Max Tokens**: 800
  - Sufficient for comprehensive action plan

### Safety Settings
- **Harm Categories**: Standard filtering
- **Block Threshold**: BLOCK_MEDIUM_AND_ABOVE
- **Rationale**: Standard safety for business content

## Performance Characteristics

### Expected Response Time
- **Target**: < 8 seconds
- **Typical**: 3-6 seconds

### Quality Metrics
- **Action Specificity**: > 90% concrete, implementable actions
- **Sequencing Logic**: > 85% logical progression of steps
- **Resource Accuracy**: > 90% realistic resource estimates

## Cost Optimization

### Token Usage
- **Input Tokens**: ~1000-1500 per idea
- **Output Tokens**: ~400-600 per idea
- **Cost per 1000 ideas**: ~$12-18 (GPT-4o)

### Batch Processing
- **Recommended Batch Size**: 10-15 ideas
- **Parallel Processing**: Up to 3 concurrent requests
- **Rate Limiting**: Standard API limits

## Quality Assurance

### Validation Checks
- JSON schema validation
- Required field completeness
- Action item count validation (3-5 items)
- Priority distribution check

### Monitoring Metrics
- Task complexity distribution
- Priority level distribution
- Processing success rate
- Timeframe realism assessment