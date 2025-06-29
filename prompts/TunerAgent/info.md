# TunerAgent Configuration

## Recommended Model Settings

### Primary Model
- **Model**: GPT-4o-mini or Claude-3-Haiku
- **Reasoning**: Fast parameter generation, deterministic output needed

### Parameters
- **Temperature**: 0.2
  - Low temperature for consistent parameter generation
- **Top P**: 0.5
  - Focused sampling for parameter selection
- **Top K**: 20
  - Limited selection for consistent tuning
- **Max Tokens**: 800
  - Sufficient for multiple parameter configurations

### Safety Settings
- **Harm Categories**: Standard filtering
- **Block Threshold**: BLOCK_MEDIUM_AND_ABOVE
- **Rationale**: Standard safety for parameter generation

## Performance Characteristics

### Expected Response Time
- **Target**: < 2 seconds
- **Typical**: 0.5-1.5 seconds

### Parameter Quality
- **Diversity**: Ensure varied parameter combinations
- **Validity**: All parameters within valid ranges
- **Coverage**: Include high/low creativity configurations

## Cost Optimization

### Token Usage
- **Input Tokens**: ~400-700 per repository
- **Output Tokens**: ~200-400 per repository
- **Cost per 1000 repos**: ~$1.00-1.50 (GPT-4o-mini)

### Batch Processing
- **Recommended Batch Size**: 20-40 repositories
- **Parallel Processing**: Up to 5 concurrent requests
- **Rate Limiting**: Standard API limits

## Quality Assurance

### Validation Checks
- Parameter range validation
- Required field presence
- JSON format validation
- Rationale length limits

### Monitoring Metrics
- Parameter distribution analysis
- Configuration diversity metrics
- Processing success rate
- Downstream performance correlation