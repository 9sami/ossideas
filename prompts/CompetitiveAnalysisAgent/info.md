# CompetitiveAnalysisAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o or Claude-3-Sonnet
- **Reasoning**: Complex market analysis requiring high-quality reasoning and competitive research

### Parameters
- **Temperature**: 0.4
  - Moderate temperature for creative yet grounded competitive analysis
- **Top P**: 0.8
  - Balanced sampling for market research outputs
- **Top K**: 50
  - Moderate token selection for diverse competitor identification
- **Max Tokens**: 1000
  - Sufficient for comprehensive competitive analysis

### Safety Settings
- **Harm Categories**: Standard filtering
- **Block Threshold**: BLOCK_MEDIUM_AND_ABOVE
- **Rationale**: Standard safety for business content

## Performance Characteristics

### Expected Response Time
- **Target**: < 10 seconds
- **Typical**: 4-8 seconds

### Quality Metrics
- **Competitor Accuracy**: > 85% real, relevant competitors
- **Advantage Clarity**: > 90% clear, defensible UVPs
- **Market Insight Quality**: > 85% actionable competitive insights

## Cost Optimization

### Token Usage
- **Input Tokens**: ~800-1200 per idea
- **Output Tokens**: ~500-800 per idea
- **Cost per 1000 ideas**: ~$12-18 (GPT-4o)

### Batch Processing
- **Recommended Batch Size**: 8-15 ideas
- **Parallel Processing**: Up to 3 concurrent requests
- **Rate Limiting**: Standard API limits

## Quality Assurance

### Validation Checks
- JSON schema validation
- Required field completeness
- Competitor count validation (2-3 direct, 2-3 indirect)
- Competitive advantage length and substance check

### Monitoring Metrics
- Competitor diversity (avoiding same competitors for different ideas)
- Threat level distribution
- Processing success rate
- Competitive advantage uniqueness assessment