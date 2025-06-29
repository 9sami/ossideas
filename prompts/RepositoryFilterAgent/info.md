# RepositoryFilterAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o-mini or Claude-3-Haiku
- **Reasoning**: Fast, cost-effective for binary classification tasks

### Parameters
- **Temperature**: 0.1
  - Low temperature for consistent, deterministic filtering decisions
- **Top P**: 0.3
  - Focused sampling for binary classification
- **Top K**: 10
  - Limited token selection for consistent outputs
- **Max Tokens**: 150
  - Sufficient for JSON response with reasoning

### Safety Settings
- **Harm Categories**: Standard filtering
- **Block Threshold**: BLOCK_MEDIUM_AND_ABOVE
- **Rationale**: Conservative approach for content filtering

## Performance Characteristics

### Expected Response Time
- **Target**: < 2 seconds
- **Typical**: 0.5-1.5 seconds

### Accuracy Metrics
- **Target Precision**: > 95% for skip decisions
- **False Positive Rate**: < 5% (incorrectly skipping valuable repos)
- **False Negative Rate**: < 10% (including low-value repos)

## Cost Optimization

### Token Usage
- **Input Tokens**: ~200-500 per repository
- **Output Tokens**: ~50-100 per repository
- **Cost per 1000 repos**: ~$0.50-1.00 (GPT-4o-mini)

### Batch Processing
- **Recommended Batch Size**: 50-100 repositories
- **Parallel Processing**: Up to 5 concurrent requests
- **Rate Limiting**: Respect API limits

## Quality Assurance

### Validation Checks
- JSON format validation
- Required field presence
- Enum value validation for skip_note.type

### Monitoring Metrics
- Processing success rate
- Average response time
- Skip rate by category
- Error frequency and types