# ANALYSIS TYPES IN OSSIDEAS

## Overview

This document provides a comprehensive overview of the analysis types used in the OSSIdeas platform. These analysis types form the foundation of our AI-powered business idea generation system, enabling structured, multi-faceted evaluation of open-source repositories for business potential.

## Analysis Types Table Structure

The `analysis_types` table defines the different kinds of analyses our AI agents can produce. Each analysis type has a specific purpose, output structure, and role in the overall business idea generation process.

| ID | Name | Description | Slug | Weightage | 
|----|------|-------------|------|-----------|
| 1 | Idea Title & Tagline | If you can't explain it in one line, you can't build it. Forces ruthless clarity. | idea-title-tagline | 15 |
| 2 | Opportunity Summary | Why should this exist? Frames the core pain point you're solving. | opportunity-summary | 15 |
| 3 | MVP Core Features | What is the absolute minimum needed to prove people want this? | mvp-core-features | 15 |
| 4 | Next Steps / Action Items | Converts this entire document from a "thought exercise" into a "build plan." | next-steps | 10 |
| 5 | Competitive Analysis | Who else is out there and why are you 10x better, cheaper, or faster? | competitive-analysis | 10 |
| 6 | Monetization Strategy | How will this make money? Proves this is a business, not a hobby. | monetization-strategy | 10 |
| 7 | Technical Stack & Workflow | The high-level blueprint of how you'll assemble existing blocks. | technical-stack | 10 |
| 8 | Success Metrics & KPIs | How do we know if we're winning? Defines key numbers to track post-launch. | success-metrics | 5 |
| 9 | Risks & Mitigations | What are the top 3 things that could kill this project? | risks-mitigations | 5 |
| 10 | Go-to-Market Plan | How will you find your first 100 users? | go-to-market | 5 |
| 11 | Market Analysis | Understanding the dynamics of a specific market. | market-analysis | 4 |
| 12 | Target Market Analysis | Identifying and understanding the specific group of consumers. | target-market-analysis | 4 |
| 13 | SWOT Analysis | Evaluating strengths, weaknesses, opportunities, and threats. | swot-analysis | 4 |
| 14 | Financial Analysis | Evaluating financial data to assess performance and stability. | financial-analysis | 3 |
| 15 | PESTEL Analysis | Analyzing political, economic, social, technological, environmental, and legal factors. | pestel-analysis | 3 |
| 16 | Market Trend Analysis | Evaluating historical data to identify patterns and predict future movements. | market-trend-analysis | 3 |
| 17 | Strategic Frameworks | Structured tools to assess market and organizational factors. | strategic-frameworks | 3 |
| 18 | GAP Analysis | Comparing current and desired states to identify deficiencies. | gap-analysis | 3 |
| 19 | Product Analysis | Evaluating product performance and usage. | product-analysis | 3 |
| 20 | Customer Analysis | Understanding customer behavior and preferences. | customer-analysis | 3 |
| 21 | Operational Analysis | Analyzing internal operations to improve efficiency. | operational-analysis | 2 |
| 22 | Data Analysis | Using data to drive insights and decisions. | data-analysis | 2 |
| 23 | Product-Market Fit Analysis | Assessing whether the product meets market demand. | product-market-fit-analysis | 2 |
| 24 | Ratio Analysis | Analyzing financial ratios such as liquidity and profitability. | ratio-analysis | 2 |
| 25 | Trend Analysis | Examining financial data over time to identify patterns. | trend-analysis | 2 |
| 26 | Break-even Analysis | Calculating the point where revenue equals costs. | break-even-analysis | 2 |
| 27 | Cost-Benefit Analysis | Comparing the costs and benefits of business decisions. | cost-benefit-analysis | 2 |
| 28 | Cash Flow Analysis | Evaluating inflow and outflow of cash in the business. | cash-flow-analysis | 2 |
| 29 | Process Analysis | Examining workflows to find improvements. | process-analysis | 1 |
| 30 | Value Chain Analysis | Breaking down business activities to understand value delivery. | value-chain-analysis | 1 |
| 31 | Capacity Analysis | Measuring production potential versus demand. | capacity-analysis | 1 |
| 32 | Workflow Analysis | Studying task flows to optimize processes. | workflow-analysis | 1 |
| 33 | Bottleneck Analysis | Identifying constraints in a process that slow down output. | bottleneck-analysis | 1 |
| 34 | Customer Segmentation | Dividing customers into groups based on behavior or demographics. | customer-segmentation | 1 |
| 35 | Customer Lifetime Value (CLV) | Predicting total value a customer brings over time. | customer-lifetime-value | 1 |
| 36 | Churn Analysis | Determining reasons why customers leave. | churn-analysis | 1 |
| 37 | Customer Satisfaction (CSAT) Analysis | Measuring how satisfied customers are. | csat-analysis | 1 |
| 38 | Net Promoter Score (NPS) Analysis | Evaluating customer loyalty based on likelihood to recommend. | nps-analysis | 1 |
| 39 | Opportunity Analysis | Evaluating the business potential of a repository. | opportunity-analysis | 4 |
| 40 | Repository Evaluation | Technical assessment of repository quality and potential. | repository-evaluation | 3 |

## Key Analysis Types for Business Idea Generation

### 1. Idea Title & Tagline (ID: 1)

**Purpose**: Creates a memorable name and compelling one-sentence value proposition that clearly communicates the essence of the business idea.

**Output Structure**:
```json
{
  "title": "string",
  "tagline": "string",
  "brandingNotes": "string"
}
```

**Used By**: IdeaAgent

**Frontend Component**: TitleTaglineCard

### 2. Opportunity Summary (ID: 2)

**Purpose**: Frames the core problem being solved and articulates the vision for how the solution transforms the market.

**Output Structure**:
```json
{
  "problemStatement": "string",
  "productVision": "string",
  "marketSize": "string",
  "targetAudience": "string"
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: OpportunitySummaryCard

### 3. MVP Core Features (ID: 3)

**Purpose**: Identifies the minimum set of features needed to validate the business idea with real users.

**Output Structure**:
```json
{
  "features": [
    {
      "name": "string",
      "description": "string",
      "priority": "high|medium|low",
      "userValue": "string"
    }
  ],
  "mvpScope": "string",
  "futureFeatures": ["string"]
}
```

**Used By**: MVPFeaturesAgent (Proposed)

**Frontend Component**: CoreFeaturesCard

### 4. Next Steps / Action Items (ID: 4)

**Purpose**: Converts the business idea into an actionable plan with specific, prioritized tasks.

**Output Structure**:
```json
{
  "actionItems": [
    {
      "task": "string",
      "priority": "high|medium|low",
      "timeframe": "string",
      "resources": "string"
    }
  ],
  "immediateNextSteps": ["string"],
  "milestones": [
    {
      "name": "string",
      "description": "string",
      "targetDate": "string"
    }
  ]
}
```

**Used By**: ActionItemsAgent (Proposed)

**Frontend Component**: ActionItemsCard

### 5. Competitive Analysis (ID: 5)

**Purpose**: Identifies and assesses competitors, their strengths, weaknesses, and market positioning.

**Output Structure**:
```json
{
  "directCompetitors": [
    {
      "name": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "marketShare": "string"
    }
  ],
  "indirectCompetitors": [
    {
      "name": "string",
      "description": "string",
      "threat": "high|medium|low"
    }
  ],
  "competitiveAdvantage": "string"
}
```

**Used By**: CompetitiveAnalysisAgent (Proposed)

**Frontend Component**: CompetitiveAnalysisCard

### 6. Monetization Strategy (ID: 6)

**Purpose**: Develops detailed business models, pricing strategies, and revenue streams.

**Output Structure**:
```json
{
  "pricingModel": "string",
  "pricingTiers": [
    {
      "name": "string",
      "price": "string",
      "keyFeatures": ["string"]
    }
  ],
  "valueMetric": "string",
  "revenueStreams": ["string"]
}
```

**Used By**: MonetizationStrategyAgent (Proposed)

**Frontend Component**: MonetizationStrategyCard

### 7. Technical Stack & Workflow (ID: 7)

**Purpose**: Recommends technologies, components, and implementation workflow for building the solution.

**Output Structure**:
```json
{
  "coreComponents": [
    {
      "name": "string",
      "purpose": "string",
      "alternatives": ["string"]
    }
  ],
  "workflow": {
    "steps": [
      {
        "name": "string",
        "description": "string"
      }
    ]
  },
  "implementationComplexity": "low|medium|high"
}
```

**Used By**: TechStackAgent (Proposed)

**Frontend Component**: TechStackCard

### 8. Success Metrics & KPIs (ID: 8)

**Purpose**: Defines key performance indicators and metrics to track business success.

**Output Structure**:
```json
{
  "acquisitionMetrics": [
    {
      "name": "string",
      "target": "string",
      "importance": "high|medium|low"
    }
  ],
  "activationMetrics": [
    {
      "name": "string",
      "target": "string",
      "importance": "high|medium|low"
    }
  ],
  "retentionMetrics": [
    {
      "name": "string",
      "target": "string",
      "importance": "high|medium|low"
    }
  ],
  "revenueMetrics": [
    {
      "name": "string",
      "target": "string",
      "importance": "high|medium|low"
    }
  ]
}
```

**Used By**: MetricsAgent (Proposed)

**Frontend Component**: MetricsCard

### 9. Risks & Mitigations (ID: 9)

**Purpose**: Identifies potential risks that could derail the business and strategies to mitigate them.

**Output Structure**:
```json
{
  "risks": [
    {
      "description": "string",
      "impact": "high|medium|low",
      "probability": "high|medium|low",
      "mitigation": "string"
    }
  ],
  "criticalRisks": ["string"],
  "contingencyPlans": ["string"]
}
```

**Used By**: RiskAnalysisAgent (Proposed)

**Frontend Component**: RisksCard

### 10. Go-to-Market Plan (ID: 10)

**Purpose**: Outlines strategies for launching the product and acquiring initial users.

**Output Structure**:
```json
{
  "launchChannels": ["string"],
  "launchHook": "string",
  "targetAudience": "string",
  "marketingTactics": ["string"],
  "timelineToLaunch": "string",
  "successCriteria": ["string"]
}
```

**Used By**: GTMAgent (Proposed)

**Frontend Component**: GoToMarketCard

### 11. Market Analysis (ID: 11)

**Purpose**: Analyzes the market dynamics, size, and growth potential for a business idea.

**Output Structure**:
```json
{
  "marketSize": "string",
  "growthRate": "string",
  "marketSegments": ["string"],
  "keyTrends": ["string"],
  "barriers": ["string"]
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: MarketAnalysisCard

### 12. Target Market Analysis (ID: 12)

**Purpose**: Identifies and analyzes the specific customer segments that would benefit from the business idea.

**Output Structure**:
```json
{
  "primarySegment": {
    "description": "string",
    "demographics": "string",
    "psychographics": "string",
    "painPoints": ["string"],
    "size": "string"
  },
  "secondarySegments": [
    {
      "description": "string",
      "demographics": "string",
      "painPoints": ["string"]
    }
  ],
  "buyerPersonas": [
    {
      "name": "string",
      "role": "string",
      "goals": ["string"],
      "challenges": ["string"]
    }
  ]
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: TargetMarketCard

### 13. SWOT Analysis (ID: 13)

**Purpose**: Evaluates the strengths, weaknesses, opportunities, and threats for a business idea.

**Output Structure**:
```json
{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "opportunities": ["string"],
  "threats": ["string"],
  "risks": [
    {
      "description": "string",
      "impact": "high|medium|low",
      "mitigation": "string"
    }
  ]
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: SWOTAnalysisCard

### 14. Financial Analysis (ID: 14)

**Purpose**: Evaluates financial data to assess performance and stability.

**Output Structure**:
```json
{
  "startupCosts": {
    "total": "string",
    "breakdown": {
      "key": "value"
    }
  },
  "operatingExpenses": {
    "monthly": "string",
    "breakdown": {
      "key": "value"
    }
  },
  "revenueProjections": {
    "year1": "string",
    "year2": "string",
    "year3": "string"
  },
  "breakEvenAnalysis": {
    "timeframe": "string",
    "assumptions": ["string"]
  }
}
```

**Used By**: FinancialAnalysisAgent (Proposed)

**Frontend Component**: FinancialAnalysisCard

### 15. PESTEL Analysis (ID: 15)

**Purpose**: Analyzes political, economic, social, technological, environmental, and legal factors affecting a business.

**Output Structure**:
```json
{
  "political": {
    "factors": ["string"],
    "impact": "positive|negative|neutral"
  },
  "economic": {
    "factors": ["string"],
    "impact": "positive|negative|neutral"
  },
  "social": {
    "factors": ["string"],
    "impact": "positive|negative|neutral"
  },
  "technological": {
    "factors": ["string"],
    "impact": "positive|negative|neutral"
  },
  "environmental": {
    "factors": ["string"],
    "impact": "positive|negative|neutral"
  },
  "legal": {
    "factors": ["string"],
    "impact": "positive|negative|neutral"
  }
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: PESTELAnalysisCard

### 16. Market Trend Analysis (ID: 16)

**Purpose**: Evaluates historical data to identify patterns and predict future market movements.

**Output Structure**:
```json
{
  "historicalTrends": [
    {
      "period": "string",
      "trend": "string",
      "impact": "high|medium|low"
    }
  ],
  "emergingTrends": ["string"],
  "predictedDevelopments": ["string"],
  "marketCycle": "growth|maturity|decline|renewal",
  "disruptiveFactors": ["string"]
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: MarketTrendCard

### 17. Strategic Frameworks (ID: 17)

**Purpose**: Applies structured tools to assess market and organizational factors.

**Output Structure**:
```json
{
  "frameworkType": "string",
  "analysis": {
    "key": "value"
  },
  "insights": ["string"],
  "recommendations": ["string"]
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: StrategicFrameworkCard

### 18. GAP Analysis (ID: 18)

**Purpose**: Compares current and desired states to identify deficiencies.

**Output Structure**:
```json
{
  "currentState": {
    "description": "string",
    "metrics": {
      "key": "value"
    }
  },
  "desiredState": {
    "description": "string",
    "metrics": {
      "key": "value"
    }
  },
  "gaps": [
    {
      "description": "string",
      "severity": "high|medium|low",
      "actionItems": ["string"]
    }
  ]
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: GAPAnalysisCard

### 19. Product Analysis (ID: 19)

**Purpose**: Evaluates product performance and usage to identify improvement opportunities.

**Output Structure**:
```json
{
  "productOverview": "string",
  "keyFeatures": ["string"],
  "performanceMetrics": [
    {
      "metric": "string",
      "value": "string",
      "benchmark": "string"
    }
  ],
  "userFeedback": {
    "positives": ["string"],
    "negatives": ["string"]
  },
  "competitivePosition": "string",
  "improvementOpportunities": ["string"]
}
```

**Used By**: ProductAnalysisAgent (Proposed)

**Frontend Component**: ProductAnalysisCard

### 20. Customer Analysis (ID: 20)

**Purpose**: Understands customer behavior, preferences, and needs to improve product-market fit.

**Output Structure**:
```json
{
  "customerTypes": [
    {
      "type": "string",
      "description": "string",
      "percentage": "string"
    }
  ],
  "customerBehavior": {
    "purchasePatterns": ["string"],
    "usagePatterns": ["string"],
    "decisionFactors": ["string"]
  },
  "painPoints": ["string"],
  "customerJourney": [
    {
      "stage": "string",
      "touchpoints": ["string"],
      "emotions": ["string"],
      "opportunities": ["string"]
    }
  ],
  "recommendations": ["string"]
}
```

**Used By**: CustomerAnalysisAgent (Proposed)

**Frontend Component**: CustomerAnalysisCard

### 21. Operational Analysis (ID: 21)

**Purpose**: Analyzes internal operations to identify efficiency improvements.

**Output Structure**:
```json
{
  "operationalProcesses": [
    {
      "name": "string",
      "currentEfficiency": "string",
      "bottlenecks": ["string"],
      "improvementOpportunities": ["string"]
    }
  ],
  "resourceUtilization": "string",
  "qualityMetrics": {
    "key": "value"
  },
  "recommendations": ["string"]
}
```

**Used By**: OperationalAnalysisAgent (Proposed)

**Frontend Component**: OperationalAnalysisCard

### 22. Data Analysis (ID: 22)

**Purpose**: Uses data to drive insights and decisions for business strategy.

**Output Structure**:
```json
{
  "dataSourcesAnalyzed": ["string"],
  "keyMetrics": [
    {
      "name": "string",
      "value": "string",
      "trend": "increasing|stable|decreasing"
    }
  ],
  "correlations": [
    {
      "variables": ["string", "string"],
      "strength": "strong|moderate|weak",
      "direction": "positive|negative"
    }
  ],
  "insights": ["string"],
  "dataGaps": ["string"],
  "recommendations": ["string"]
}
```

**Used By**: DataAnalysisAgent (Proposed)

**Frontend Component**: DataAnalysisCard

### 23. Product-Market Fit Analysis (ID: 23)

**Purpose**: Assesses whether the product meets market demand and solves real customer problems.

**Output Structure**:
```json
{
  "productMarketFitScore": "string",
  "userRetention": "string",
  "userGrowth": "string",
  "netPromoterScore": "string",
  "customerInterviews": [
    {
      "segment": "string",
      "keyInsights": ["string"],
      "fitAssessment": "strong|moderate|weak"
    }
  ],
  "valueProposition": "string",
  "improvementAreas": ["string"]
}
```

**Used By**: ProductAnalysisAgent (Proposed)

**Frontend Component**: ProductMarketFitAnalysisCard

### 24. Ratio Analysis (ID: 24)

**Purpose**: Analyzes financial ratios such as liquidity and profitability to assess business health.

**Output Structure**:
```json
{
  "profitabilityRatios": {
    "grossMargin": "string",
    "operatingMargin": "string",
    "netProfitMargin": "string"
  },
  "liquidityRatios": {
    "currentRatio": "string",
    "quickRatio": "string"
  },
  "efficiencyRatios": {
    "assetTurnover": "string",
    "inventoryTurnover": "string"
  },
  "interpretation": "string",
  "recommendations": ["string"]
}
```

**Used By**: FinancialAnalysisAgent (Proposed)

**Frontend Component**: RatioAnalysisCard

### 25. Trend Analysis (ID: 25)

**Purpose**: Examines financial data over time to identify patterns and project future performance.

**Output Structure**:
```json
{
  "revenueGrowth": {
    "historical": ["string"],
    "projected": ["string"]
  },
  "costTrends": {
    "historical": ["string"],
    "projected": ["string"]
  },
  "profitabilityTrends": {
    "historical": ["string"],
    "projected": ["string"]
  },
  "seasonalPatterns": ["string"],
  "anomalies": ["string"],
  "insights": "string"
}
```

**Used By**: FinancialAnalysisAgent (Proposed)

**Frontend Component**: TrendAnalysisCard

### 26. Break-even Analysis (ID: 26)

**Purpose**: Calculates the point where revenue equals costs to determine when a business becomes profitable.

**Output Structure**:
```json
{
  "fixedCosts": "string",
  "variableCostsPerUnit": "string",
  "pricePerUnit": "string",
  "breakEvenUnits": "string",
  "breakEvenRevenue": "string",
  "breakEvenTimeframe": "string",
  "sensitivityAnalysis": [
    {
      "factor": "string",
      "impact": "string"
    }
  ]
}
```

**Used By**: FinancialAnalysisAgent (Proposed)

**Frontend Component**: BreakEvenAnalysisCard

### 27. Cost-Benefit Analysis (ID: 27)

**Purpose**: Compares the costs and benefits of business decisions to determine if they are financially viable.

**Output Structure**:
```json
{
  "costs": {
    "initialInvestment": "string",
    "ongoingCosts": "string",
    "hiddenCosts": ["string"]
  },
  "benefits": {
    "directRevenue": "string",
    "costSavings": "string",
    "intangibleBenefits": ["string"]
  },
  "netBenefit": "string",
  "roi": "string",
  "paybackPeriod": "string",
  "recommendation": "string"
}
```

**Used By**: FinancialAnalysisAgent (Proposed)

**Frontend Component**: CostBenefitAnalysisCard

### 28. Cash Flow Analysis (ID: 28)

**Purpose**: Evaluates the inflow and outflow of cash in the business to ensure liquidity.

**Output Structure**:
```json
{
  "initialInvestment": "string",
  "monthlyCashFlows": [
    {
      "month": "string",
      "inflows": "string",
      "outflows": "string",
      "netCashFlow": "string"
    }
  ],
  "cumulativeCashFlow": "string",
  "cashFlowBreakEven": "string",
  "liquidityRisks": ["string"],
  "recommendations": ["string"]
}
```

**Used By**: FinancialAnalysisAgent (Proposed)

**Frontend Component**: CashFlowAnalysisCard

### 29. Process Analysis (ID: 29)

**Purpose**: Examines specific workflows to identify improvements and efficiencies.

**Output Structure**:
```json
{
  "processName": "string",
  "processSteps": [
    {
      "name": "string",
      "duration": "string",
      "resources": ["string"],
      "bottlenecks": ["string"]
    }
  ],
  "processEfficiency": "string",
  "wastagePoints": ["string"],
  "optimizationOpportunities": ["string"],
  "automationPotential": "high|medium|low"
}
```

**Used By**: OperationalAnalysisAgent (Proposed)

**Frontend Component**: ProcessAnalysisCard

### 30. Value Chain Analysis (ID: 30)

**Purpose**: Breaks down business activities to understand how value is created and delivered.

**Output Structure**:
```json
{
  "primaryActivities": [
    {
      "name": "string",
      "description": "string",
      "valueContribution": "high|medium|low",
      "improvementOpportunities": ["string"]
    }
  ],
  "supportActivities": [
    {
      "name": "string",
      "description": "string",
      "valueContribution": "high|medium|low",
      "improvementOpportunities": ["string"]
    }
  ],
  "valueProposition": "string",
  "competitiveAdvantage": "string"
}
```

**Used By**: OperationalAnalysisAgent (Proposed)

**Frontend Component**: ValueChainAnalysisCard

### 31. Capacity Analysis (ID: 31)

**Purpose**: Measures production potential versus demand to identify resource constraints.

**Output Structure**:
```json
{
  "currentCapacity": "string",
  "demandForecast": "string",
  "capacityGap": "string",
  "resourceConstraints": [
    {
      "resource": "string",
      "constraint": "string",
      "impact": "high|medium|low"
    }
  ],
  "scalingOptions": ["string"],
  "recommendations": ["string"]
}
```

**Used By**: OperationalAnalysisAgent (Proposed)

**Frontend Component**: CapacityAnalysisCard

### 32. Workflow Analysis (ID: 32)

**Purpose**: Studies task flows to optimize processes and improve efficiency.

**Output Structure**:
```json
{
  "workflowName": "string",
  "workflowSteps": [
    {
      "name": "string",
      "dependencies": ["string"],
      "timeRequired": "string",
      "resourcesRequired": ["string"]
    }
  ],
  "criticalPath": ["string"],
  "bottlenecks": ["string"],
  "optimizationOpportunities": ["string"],
  "automationPotential": ["string"]
}
```

**Used By**: OperationalAnalysisAgent (Proposed)

**Frontend Component**: WorkflowAnalysisCard

### 33. Bottleneck Analysis (ID: 33)

**Purpose**: Identifies constraints in a process that slow down output and limit throughput.

**Output Structure**:
```json
{
  "identifiedBottlenecks": [
    {
      "location": "string",
      "description": "string",
      "impact": "high|medium|low",
      "rootCauses": ["string"]
    }
  ],
  "throughputLimitations": "string",
  "resolutionOptions": [
    {
      "description": "string",
      "cost": "high|medium|low",
      "timeToImplement": "string",
      "expectedImpact": "high|medium|low"
    }
  ],
  "prioritizedSolutions": ["string"]
}
```

**Used By**: OperationalAnalysisAgent (Proposed)

**Frontend Component**: BottleneckAnalysisCard

### 34. Customer Segmentation (ID: 34)

**Purpose**: Divides customers into groups based on behavior or demographics for targeted marketing.

**Output Structure**:
```json
{
  "segments": [
    {
      "name": "string",
      "description": "string",
      "demographics": {
        "key": "value"
      },
      "behavioralTraits": ["string"],
      "needs": ["string"],
      "size": "string",
      "growthPotential": "high|medium|low"
    }
  ],
  "segmentationCriteria": ["string"],
  "prioritySegments": ["string"],
  "targetingRecommendations": ["string"]
}
```

**Used By**: CustomerAnalysisAgent (Proposed)

**Frontend Component**: CustomerSegmentationCard

### 35. Customer Lifetime Value (CLV) Analysis (ID: 35)

**Purpose**: Predicts the total value a customer brings over their entire relationship with a business.

**Output Structure**:
```json
{
  "averagePurchaseValue": "string",
  "purchaseFrequency": "string",
  "customerLifespan": "string",
  "acquisitionCost": "string",
  "retentionCost": "string",
  "clvCalculation": "string",
  "segmentedClv": [
    {
      "segment": "string",
      "value": "string"
    }
  ],
  "improvementStrategies": ["string"]
}
```

**Used By**: CustomerAnalysisAgent (Proposed)

**Frontend Component**: CLVAnalysisCard

### 36. Churn Analysis (ID: 36)

**Purpose**: Determines reasons why customers leave and strategies to improve retention.

**Output Structure**:
```json
{
  "churnRate": "string",
  "churnPatterns": [
    {
      "pattern": "string",
      "percentage": "string"
    }
  ],
  "churnReasons": [
    {
      "reason": "string",
      "frequency": "high|medium|low",
      "impact": "high|medium|low"
    }
  ],
  "atRiskSegments": ["string"],
  "retentionStrategies": ["string"],
  "expectedImpact": "string"
}
```

**Used By**: CustomerAnalysisAgent (Proposed)

**Frontend Component**: ChurnAnalysisCard

### 37. Customer Satisfaction (CSAT) Analysis (ID: 37)

**Purpose**: Measures how satisfied customers are with products or services.

**Output Structure**:
```json
{
  "overallSatisfactionScore": "string",
  "satisfactionByFeature": [
    {
      "feature": "string",
      "score": "string"
    }
  ],
  "satisfactionBySegment": [
    {
      "segment": "string",
      "score": "string"
    }
  ],
  "keyDrivers": ["string"],
  "improvementAreas": ["string"],
  "recommendedActions": ["string"]
}
```

**Used By**: CustomerAnalysisAgent (Proposed)

**Frontend Component**: CSATAnalysisCard

### 38. Net Promoter Score (NPS) Analysis (ID: 38)

**Purpose**: Evaluates customer loyalty based on likelihood to recommend.

**Output Structure**:
```json
{
  "overallNpsScore": "string",
  "promoters": "string",
  "passives": "string",
  "detractors": "string",
  "npsBySegment": [
    {
      "segment": "string",
      "score": "string"
    }
  ],
  "promoterCharacteristics": ["string"],
  "detractorCharacteristics": ["string"],
  "improvementStrategies": ["string"]
}
```

**Used By**: CustomerAnalysisAgent (Proposed)

**Frontend Component**: NPSAnalysisCard

### 39. Opportunity Analysis (ID: 39)

**Purpose**: Evaluates the overall business potential of a repository, including problem statement, product vision, and market validation.

**Output Structure**:
```json
{
  "opportunityRank": "string",
  "problemStatement": "string",
  "productVision": "string",
  "marketValidation": {
    "validatedDemand": "string",
    "marketTrend": "string"
  },
  "strategicScores": {
    "licenseSuitability": "string",
    "uiUxPotential": "string",
    "marketDemand": "string",
    "integrationEase": "string",
    "valueAddition": "string",
    "competitionIntensity": "string",
    "monetizationPotential": "string",
    "complexityLevel": "string"
  },
  "repositoryMetadata": {
    "url": "string",
    "license": "string",
    "lastActivity": "string",
    "openIssues": "string",
    "createdDate": "string"
  }
}
```

**Used By**: TunedOpportunityAgent

**Frontend Component**: OpportunityAnalysisCard

### 40. Repository Evaluation (ID: 40)

**Purpose**: Technical assessment of repository quality, code structure, and development potential.

**Output Structure**:
```json
{
  "codeQuality": {
    "score": "number",
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "documentation": {
    "score": "number",
    "completeness": "string",
    "recommendations": ["string"]
  },
  "communityHealth": {
    "score": "number",
    "contributorCount": "number",
    "issueResponseTime": "string",
    "pullRequestActivity": "string"
  },
  "technicalDebt": {
    "score": "number",
    "areas": ["string"],
    "recommendations": ["string"]
  }
}
```

**Used By**: RepositoryRankAgent

**Frontend Component**: RepositoryEvaluationCard

## Analysis Types in the AI Pipeline

The OSSIdeas AI pipeline uses these analysis types in a specific sequence:

1. **Repository Evaluation** (ID: 40)
   - Initial technical assessment of repository quality
   - Used by RepositoryFilterAgent and RepositoryRankAgent

2. **Opportunity Analysis** (ID: 39)
   - Core business opportunity identification
   - Generated by TunedOpportunityAgent

3. **Market Analysis** (ID: 11) & **Target Market Analysis** (ID: 12)
   - Market dynamics and customer segment identification
   - Generated by TunedOpportunityAgent

4. **Competitive Analysis** (ID: 5)
   - Competitor assessment and positioning
   - Generated by CompetitiveAnalysisAgent (proposed)

5. **SWOT Analysis** (ID: 13)
   - Strengths, weaknesses, opportunities, and threats
   - Generated by TunedOpportunityAgent

6. **Idea Title & Tagline** (ID: 1)
   - Memorable name and compelling value proposition
   - Generated by IdeaAgent

## Database Relationships

The `analysis_types` table is related to the `analysis_results` table through the `analysis_type_id` foreign key. Each analysis result is associated with either an idea or a repository:

```
analysis_types (1) --- (*) analysis_results (*) --- (1) ideas
                                  |
                                  |
                                  v
                               repositories
```

This structure allows for flexible analysis generation and storage, with each analysis type having its own specialized output format and purpose.

## Conclusion

The analysis types in the OSSIdeas platform provide a comprehensive framework for evaluating business opportunities from open-source repositories. By using specialized AI agents to generate different types of analyses, the platform can provide users with detailed, actionable business ideas.

The proposed enhancements to the analysis types and AI agents will further improve the quality and comprehensiveness of the generated business ideas, covering all key aspects from initial concept to go-to-market strategy.