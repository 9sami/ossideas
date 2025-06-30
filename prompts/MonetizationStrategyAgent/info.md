# MonetizationStrategyAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o or Claude-3-Sonnet
- **Reasoning**: Complex business strategy requiring high-quality reasoning and market understanding

### Parameters
- **Temperature**: 0.4
  - Moderate temperature for creative yet practical monetization strategies
- **Top P**: 0.8
  - Balanced sampling for business model outputs
- **Top K**: 50
  - Moderate token selection for diverse pricing strategies
- **Max Tokens**: 800
  - Sufficient for comprehensive monetization strategy

### Safety Settings
- **Harm Categories**: Standard filtering
- **Block Threshold**: BLOCK_MEDIUM_AND_ABOVE
- **Rationale**: Standard safety for business content

## Performance Characteristics

### Expected Response Time
- **Target**: < 8 seconds
- **Typical**: 3-6 seconds

### Quality Metrics
- **Pricing Realism**: > 90% market-appropriate pricing
- **Tier Differentiation**: > 85% clear value progression
- **Revenue Model Viability**: > 90% viable business models

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
- Pricing tier count validation (2-5 tiers)
- Pricing model enum validation

### Monitoring Metrics
- Pricing model distribution
- Average tier count
- Processing success rate
- Revenue stream diversity assessment