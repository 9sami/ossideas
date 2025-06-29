# RepositoryRankAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o-mini or Claude-3-Haiku
- **Reasoning**: Good balance of speed and analytical capability for scoring

### Parameters
- **Temperature**: 0.3
  - Moderate temperature for consistent but nuanced scoring
- **Top P**: 0.7
  - Balanced sampling for scoring decisions
- **Top K**: 40
  - Moderate token selection for scoring consistency
- **Max Tokens**: 300
  - Sufficient for JSON response with scores

### Safety Settings
- **Harm Categories**: Standard filtering
- **Block Threshold**: BLOCK_MEDIUM_AND_ABOVE
- **Rationale**: Standard safety for business analysis

## Performance Characteristics

### Expected Response Time
- **Target**: < 3 seconds
- **Typical**: 1-2 seconds

### Scoring Consistency
- **Target Variance**: < 10% for same repository
- **Inter-rater Reliability**: > 0.8 correlation with human scores
- **Score Distribution**: Normal distribution across 1-10 range

## Cost Optimization

### Token Usage
- **Input Tokens**: ~300-600 per repository
- **Output Tokens**: ~100-200 per repository
- **Cost per 1000 repos**: ~$1.00-2.00 (GPT-4o-mini)

### Batch Processing
- **Recommended Batch Size**: 25-50 repositories
- **Parallel Processing**: Up to 3 concurrent requests
- **Rate Limiting**: Conservative for scoring accuracy

## Quality Assurance

### Validation Checks
- Score range validation (1-10)
- Total score calculation verification
- Required field presence
- Numeric type validation

### Monitoring Metrics
- Average scores by category
- Score distribution analysis
- Processing success rate
- Correlation with human evaluations