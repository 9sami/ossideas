// RepositoryAnalysis.ts
// Centralized repository for all repository analysis interfaces and types

// --- Competitive Analysis ---
export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
}

export interface IndirectCompetitor {
  name: string;
  description: string;
  threat: 'high' | 'medium' | 'low';
}

export interface CompetitiveAnalysisData {
  directCompetitors: Competitor[];
  indirectCompetitors: IndirectCompetitor[];
  competitiveAdvantage: string;
}

// --- Tech Stack Analysis ---
export interface CoreComponent {
  name: string;
  purpose: string;
  alternatives: string[];
}

export interface WorkflowStep {
  name: string;
  description: string;
}

export interface TechStackData {
  coreComponents: CoreComponent[];
  workflow: {
    steps: WorkflowStep[];
  };
  implementationComplexity: 'low' | 'medium' | 'high';
}

// --- Metrics Analysis ---
export interface Metric {
  name: string;
  target: string;
  importance: 'high' | 'medium' | 'low';
}

export interface MetricsData {
  acquisitionMetrics: Metric[];
  activationMetrics: Metric[];
  retentionMetrics: Metric[];
  revenueMetrics: Metric[];
}

// --- MVP Features Analysis ---
export interface Feature {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  userValue: string;
}

export interface MVPFeaturesData {
  features: Feature[];
  mvpScope: string;
  futureFeatures: string[];
}

// --- Risk Analysis ---
export interface Risk {
  description: string;
  impact: 'high' | 'medium' | 'low';
  probability: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface RiskAnalysisData {
  risks: Risk[];
  criticalRisks: string[];
  contingencyPlans: string[];
}

interface PricingTier {
  name: string;
  price: string;
  keyFeatures: string[];
}

export interface MonetizationStrategyData {
  pricingModel: string;
  pricingTiers: PricingTier[];
  valueMetric: string;
  revenueStreams: string[];
}


// --- Unified AnalysisResult ---
export type RepositoryAnalysisPayload =
  | CompetitiveAnalysisData
  | TechStackData
  | MetricsData
  | MVPFeaturesData
  | RiskAnalysisData
  | ActionItemsData
  | GoToMarketData
  | MonetizationStrategyData
  | string;


export interface GoToMarketData {
  launchChannels: string[];
  launchHook: string;
  targetAudience: string;
  marketingTactics: string[];
  timelineToLaunch: string;
  successCriteria: string[];
}
export interface ActionItemsData {
  actionItems: ActionItem[];
  immediateNextSteps: string[];
  milestones: Milestone[];
}
interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  resources: string;
}

interface Milestone {
  name: string;
  description: string;
  targetDate: string;
}

export interface AnalysisResult {
  id: string;
  title: string;
  analysis_type_id: number;
  analysis_payload: RepositoryAnalysisPayload;
  summary_description?: string;
  analysis_type?: {
    name: string;
    slug: string;
  };
}
