import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  ExternalLink,
  Zap,
  DollarSign,
  Code,
  Target,
  TrendingUp,
  AlertTriangle,
  Star,
  GitFork,
  Eye,
  Calendar,
  Github,
  CheckCircle,
  HelpCircle,
  BarChart,
  Lightbulb,
  LineChart,
  ShieldCheck,
  Rocket,
} from 'lucide-react';
import { useIdeaById } from '../hooks/useIdeaById';
import { useSavedIdeas } from '../hooks/useSavedIdeas';
import { useAuth } from '../hooks/useAuth';
import FullScreenLoader from '../components/FullScreenLoader';
import ShareModal from '../components/ShareModal';
import AuthModal from '../components/AuthModal';

const IdeaDetail: React.FC = () => {
  const { id, owner, repo } = useParams<{ id?: string; owner?: string; repo?: string }>();
  const navigate = useNavigate();
  const repositoryFullName = owner && repo ? `${owner}/${repo}` : undefined;
  const { idea, loading, error } = useIdeaById(id, repositoryFullName);
  const { isIdeaSaved, toggleSaveIdea } = useSavedIdeas();
  const { authState } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const isSaved = idea?.id ? isIdeaSaved(idea.id) : false;

  // Group analysis results by type and organize them
  const analysisData = useMemo(() => {
    if (!idea || !idea.analysisResults) return {};
    
    const grouped: Record<string, any> = {};
    
    // First, map analysis types to their respective tabs
    const analysisTypeToTab: Record<string, string> = {
      'Opportunity Analysis': 'overview',
      'Opportunity Summary': 'overview',
      'Market Analysis': 'market',
      'Target Market Analysis': 'market',
      'Monetization Strategy': 'monetization',
      'Technical Stack & Workflow': 'tech',
      'Competitive Analysis': 'competitive',
      'Key Differentiators': 'competitive',
      'Risks & Mitigations': 'risks',
      'MVP Core Features': 'features',
      'Next Steps / Action Items': 'action',
      'Success Metrics & KPIs': 'metrics',
      'Go-to-Market Plan': 'gtm',
    };
    
    // Process each analysis result
    idea.analysisResults.forEach(result => {
      const typeName = result.analysis_type?.name || 'Other';
      const tabKey = analysisTypeToTab[typeName] || 'other';
      
      if (!grouped[tabKey]) {
        grouped[tabKey] = [];
      }
      
      grouped[tabKey].push({
        id: result.id,
        title: result.title,
        summary: result.summary_description,
        payload: result.analysis_payload,
        type: result.analysis_type,
      });
    });
    
    return grouped;
  }, [idea]);

  // Define tabs based on available data
  const tabs = useMemo(() => {
    const defaultTabs = [
      { id: 'overview', label: 'Overview', icon: Target },
      { id: 'market', label: 'Market', icon: BarChart },
      { id: 'features', label: 'Features', icon: Lightbulb },
      { id: 'tech', label: 'Tech Stack', icon: Code },
      { id: 'monetization', label: 'Monetization', icon: DollarSign },
      { id: 'competitive', label: 'Competition', icon: TrendingUp },
      { id: 'risks', label: 'Risks', icon: ShieldCheck },
      { id: 'action', label: 'Action Items', icon: CheckCircle },
      { id: 'metrics', label: 'Metrics', icon: LineChart },
      { id: 'gtm', label: 'Go-to-Market', icon: Rocket },
    ];
    
    // Only show tabs that have data
    return defaultTabs.filter(tab => 
      tab.id === 'overview' || // Always show overview
      (analysisData[tab.id] && analysisData[tab.id].length > 0)
    );
  }, [analysisData]);

  // Set initial active tab based on available data
  React.useEffect(() => {
    if (tabs.length > 0 && !analysisData[activeTab]) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, analysisData, activeTab]);

  const handleSaveClick = async () => {
    if (!authState.user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!idea?.id) return;

    setIsSaving(true);
    try {
      await toggleSaveIdea(idea.id);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  // Check if this is a repository-based idea (has GitHub-style project name)
  const isRepositoryBased = useMemo(() => {
    return (
      idea?.ossProject.includes('/') && !idea.ossProject.startsWith('http')
    );
  }, [idea?.ossProject]);

  // Extract repository stats from the idea if it's repository-based
  const repositoryStats = useMemo(() => {
    if (!isRepositoryBased || !idea) return null;

    // Use actual repository data if available
    if (idea.repository) {
      return {
        stars: idea.repository.stargazers_count || 0,
        forks: idea.repository.forks_count || 0,
        watchers: idea.repository.watchers_count || 0,
        issues: idea.repository.open_issues_count || 0,
        lastCommit: idea.repository.last_commit_at ? 
          `Updated ${new Date(idea.repository.last_commit_at).toLocaleDateString()}` : 
          'Unknown',
      };
    }

    // Extract stats from the competitive advantage or generate mock stats
    const starsMatch = idea.competitiveAdvantage.match(
      /(\d+(?:,\d+)*)\s*stars?/i,
    );
    const stars = starsMatch
      ? parseInt(starsMatch[1].replace(/,/g, ''))
      : Math.floor(Math.random() * 10000) + 100;

    return {
      stars,
      forks: Math.floor(stars * 0.1),
      watchers: Math.floor(stars * 0.05),
      issues: Math.floor(stars * 0.02),
      lastCommit: 'Updated 2 days ago',
    };
  }, [idea, isRepositoryBased]);

  // Format analysis payload for better readability
  const renderAnalysisContent = (analysis: any) => {
    if (!analysis || !analysis.payload) {
      return <div className="text-gray-500 italic">No data available</div>;
    }
    
    // Handle different analysis types with custom renderers
    const analysisType = analysis.type?.slug || '';
    
    // MVP Features
    if (analysisType === 'mvp-core-features' || analysis.title?.includes('MVP') || analysis.title?.includes('Features')) {
      return renderMVPFeatures(analysis.payload);
    }
    
    // Action Items
    if (analysisType === 'next-steps' || analysis.title?.includes('Action') || analysis.title?.includes('Steps')) {
      return renderActionItems(analysis.payload);
    }
    
    // Competitive Analysis
    if (analysisType === 'competitive-analysis' || analysis.title?.includes('Competitive')) {
      return renderCompetitiveAnalysis(analysis.payload);
    }
    
    // Monetization Strategy
    if (analysisType === 'monetization-strategy' || analysis.title?.includes('Monetization')) {
      return renderMonetizationStrategy(analysis.payload);
    }
    
    // Technical Stack
    if (analysisType === 'technical-stack' || analysis.title?.includes('Tech') || analysis.title?.includes('Stack')) {
      return renderTechStack(analysis.payload);
    }
    
    // Metrics & KPIs
    if (analysisType === 'success-metrics' || analysis.title?.includes('Metrics') || analysis.title?.includes('KPI')) {
      return renderMetrics(analysis.payload);
    }
    
    // Risks & Mitigations
    if (analysisType === 'risks-mitigations' || analysis.title?.includes('Risk')) {
      return renderRisks(analysis.payload);
    }
    
    // Go-to-Market
    if (analysisType === 'go-to-market' || analysis.title?.includes('Market')) {
      return renderGoToMarket(analysis.payload);
    }
    
    // Opportunity Analysis
    if (analysisType === 'opportunity-analysis' || analysis.title?.includes('Opportunity')) {
      return renderOpportunityAnalysis(analysis.payload);
    }
    
    // Default renderer for other types
    return renderGenericAnalysis(analysis.payload);
  };
  
  // Specialized renderers for different analysis types
  const renderMVPFeatures = (payload: any) => {
    let features = [];
    let mvpScope = '';
    let futureFeatures = [];
    
    // Parse the payload
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        features = parsed.features || [];
        mvpScope = parsed.mvpScope || '';
        futureFeatures = parsed.futureFeatures || [];
      } catch (e) {
        // If parsing fails, use default empty values
      }
    } else {
      features = payload.features || [];
      mvpScope = payload.mvpScope || '';
      futureFeatures = payload.futureFeatures || [];
    }
    
    return (
      <div className="space-y-6">
        {/* MVP Scope */}
        {mvpScope && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">MVP Scope</h4>
            <p className="text-blue-700 text-sm">{mvpScope}</p>
          </div>
        )}
        
        {/* Core Features */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Core Features</h4>
          <div className="space-y-4">
            {features.map((feature: any, index: number) => {
              const priorityColor = 
                feature.priority === 'high' ? 'bg-red-100 text-red-800' :
                feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800';
                
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{feature.name}</h5>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColor}`}>
                      {feature.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{feature.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h6 className="text-xs font-medium text-gray-700 mb-1">User Value</h6>
                    <p className="text-sm text-gray-600">{feature.userValue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Future Features */}
        {futureFeatures.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Future Features</h4>
            <ul className="list-disc pl-5 space-y-1">
              {futureFeatures.map((feature: string, index: number) => (
                <li key={index} className="text-gray-700 text-sm">{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  const renderActionItems = (payload: any) => {
    let actionItems = [];
    let immediateNextSteps = [];
    let milestones = [];
    
    // Parse the payload
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        actionItems = parsed.actionItems || [];
        immediateNextSteps = parsed.immediateNextSteps || [];
        milestones = parsed.milestones || [];
      } catch (e) {
        // If parsing fails, use default empty values
      }
    } else {
      actionItems = payload.actionItems || [];
      immediateNextSteps = payload.immediateNextSteps || [];
      milestones = payload.milestones || [];
    }
    
    return (
      <div className="space-y-6">
        {/* Immediate Next Steps */}
        {immediateNextSteps.length > 0 && (
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
            <h4 className="font-medium text-orange-800 mb-2">Start Here</h4>
            <ul className="space-y-2">
              {immediateNextSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-orange-600 text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="ml-2 text-orange-700 text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Action Items */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Action Items</h4>
          <div className="space-y-4">
            {actionItems.map((item: any, index: number) => {
              const priorityColor = 
                item.priority === 'high' ? 'bg-red-100 text-red-800' :
                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800';
                
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{item.task}</h5>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColor}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Timeframe</h6>
                      <p className="text-sm text-gray-600">{item.timeframe}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Resources</h6>
                      <p className="text-sm text-gray-600">{item.resources}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Milestones */}
        {milestones.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Milestones</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-4 relative">
                {milestones.map((milestone: any, index: number) => (
                  <div key={index} className="pl-10 relative">
                    <div className="absolute left-0 top-1.5 w-8 h-8 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center z-10">
                      <span className="text-orange-600 text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h5 className="font-medium text-gray-900 mb-2">{milestone.name}</h5>
                      <p className="text-sm text-gray-700 mb-3">{milestone.description}</p>
                      <div className="bg-gray-50 p-2 rounded-lg inline-block">
                        <span className="text-xs font-medium text-gray-600">{milestone.targetDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderCompetitiveAnalysis = (payload: any) => {
    let directCompetitors = [];
    let indirectCompetitors = [];
    let competitiveAdvantage = '';
    
    // Parse the payload
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        directCompetitors = parsed.directCompetitors || [];
        indirectCompetitors = parsed.indirectCompetitors || [];
        competitiveAdvantage = parsed.competitiveAdvantage || '';
      } catch (e) {
        // If parsing fails, use default empty values
      }
    } else {
      directCompetitors = payload.directCompetitors || [];
      indirectCompetitors = payload.indirectCompetitors || [];
      competitiveAdvantage = payload.competitiveAdvantage || '';
    }
    
    return (
      <div className="space-y-6">
        {/* Competitive Advantage */}
        {competitiveAdvantage && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Your Competitive Advantage</h4>
            <p className="text-green-700 text-sm">{competitiveAdvantage}</p>
          </div>
        )}
        
        {/* Direct Competitors */}
        {directCompetitors.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Direct Competitors</h4>
            <div className="space-y-4">
              {directCompetitors.map((competitor: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h5 className="font-medium text-gray-900 mb-2">{competitor.name}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Strengths</h6>
                      <ul className="list-disc pl-5 space-y-1">
                        {Array.isArray(competitor.strengths) ? competitor.strengths.map((strength: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600">{strength}</li>
                        )) : (
                          <li className="text-sm text-gray-600">{competitor.strengths}</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Weaknesses</h6>
                      <ul className="list-disc pl-5 space-y-1">
                        {Array.isArray(competitor.weaknesses) ? competitor.weaknesses.map((weakness: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600">{weakness}</li>
                        )) : (
                          <li className="text-sm text-gray-600">{competitor.weaknesses}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h6 className="text-xs font-medium text-gray-700 mb-1">Market Share</h6>
                    <p className="text-sm text-gray-600">{competitor.marketShare}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Indirect Competitors */}
        {indirectCompetitors.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Indirect Competitors</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {indirectCompetitors.map((competitor: any, index: number) => {
                const threatColor = 
                  competitor.threat === 'high' ? 'bg-red-100 text-red-800' :
                  competitor.threat === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800';
                  
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                      <span className={`text-xs px-2 py-1 rounded-full ${threatColor}`}>
                        {competitor.threat}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{competitor.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderMonetizationStrategy = (payload: any) => {
    let pricingModel = '';
    let pricingTiers = [];
    let valueMetric = '';
    let revenueStreams = [];
    
    // Parse the payload
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        pricingModel = parsed.pricingModel || '';
        pricingTiers = parsed.pricingTiers || [];
        valueMetric = parsed.valueMetric || '';
        revenueStreams = parsed.revenueStreams || [];
      } catch (e) {
        // If parsing fails, use default empty values
        pricingModel = payload;
      }
    } else {
      pricingModel = payload.pricingModel || '';
      pricingTiers = payload.pricingTiers || [];
      valueMetric = payload.valueMetric || '';
      revenueStreams = payload.revenueStreams || [];
    }
    
    return (
      <div className="space-y-6">
        {/* Pricing Model */}
        {pricingModel && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Pricing Model</h4>
            <p className="text-blue-700 text-sm">{pricingModel}</p>
          </div>
        )}
        
        {/* Value Metric */}
        {valueMetric && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Value Metric</h4>
            <p className="text-gray-700 text-sm">{valueMetric}</p>
          </div>
        )}
        
        {/* Pricing Tiers */}
        {pricingTiers.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Pricing Tiers</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingTiers.map((tier: any, index: number) => {
                const isPopular = index === 1; // Middle tier is usually the popular one
                
                return (
                  <div 
                    key={index} 
                    className={`relative bg-white border rounded-lg p-4 shadow-sm ${
                      isPopular ? 'border-orange-300 ring-1 ring-orange-200' : 'border-gray-200'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Popular
                        </span>
                      </div>
                    )}
                    
                    <h5 className="font-medium text-gray-900 text-center mb-2">{tier.name}</h5>
                    <div className="text-center mb-4">
                      <span className="text-xl font-bold text-gray-900">{tier.price}</span>
                    </div>
                    
                    <ul className="space-y-2">
                      {Array.isArray(tier.keyFeatures) ? tier.keyFeatures.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      )) : (
                        <li className="text-sm text-gray-700">{tier.keyFeatures}</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Revenue Streams */}
        {revenueStreams.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Additional Revenue Streams</h4>
            <ul className="list-disc pl-5 space-y-1">
              {Array.isArray(revenueStreams) ? revenueStreams.map((stream: string, index: number) => (
                <li key={index} className="text-sm text-gray-700">{stream}</li>
              )) : (
                <li className="text-sm text-gray-700">{revenueStreams}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  const renderTechStack = (payload: any) => {
    let coreComponents = [];
    let workflow = { steps: [] };
    let implementationComplexity = '';
    
    // Parse the payload
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        coreComponents = parsed.coreComponents || [];
        workflow = parsed.workflow || { steps: [] };
        implementationComplexity = parsed.implementationComplexity || '';
      } catch (e) {
        // If parsing fails, use default empty values
      }
    } else {
      coreComponents = payload.coreComponents || [];
      workflow = payload.workflow || { steps: [] };
      implementationComplexity = payload.implementationComplexity || '';
    }
    
    return (
      <div className="space-y-6">
        {/* Implementation Complexity */}
        {implementationComplexity && (
          <div className={`border rounded-lg p-4 ${
            implementationComplexity === 'high' ? 'bg-red-50 border-red-100' :
            implementationComplexity === 'medium' ? 'bg-yellow-50 border-yellow-100' :
            'bg-green-50 border-green-100'
          }`}>
            <h4 className={`font-medium mb-2 ${
              implementationComplexity === 'high' ? 'text-red-800' :
              implementationComplexity === 'medium' ? 'text-yellow-800' :
              'text-green-800'
            }`}>Implementation Complexity: {implementationComplexity}</h4>
            <p className={`text-sm ${
              implementationComplexity === 'high' ? 'text-red-700' :
              implementationComplexity === 'medium' ? 'text-yellow-700' :
              'text-green-700'
            }`}>
              {implementationComplexity === 'high' ? 'This solution requires significant development resources and expertise.' :
               implementationComplexity === 'medium' ? 'This solution requires moderate development effort with some technical expertise.' :
               'This solution can be implemented with minimal development effort.'}
            </p>
          </div>
        )}
        
        {/* Core Components */}
        {coreComponents.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Core Components</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreComponents.map((component: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h5 className="font-medium text-gray-900 mb-2">{component.name}</h5>
                  <p className="text-sm text-gray-700 mb-3">{component.purpose}</p>
                  
                  {component.alternatives && component.alternatives.length > 0 && (
                    <div>
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Alternatives</h6>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(component.alternatives) ? component.alternatives.map((alt: string, i: number) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {alt}
                          </span>
                        )) : (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {component.alternatives}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Workflow */}
        {workflow.steps && workflow.steps.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Implementation Workflow</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-4 relative">
                {workflow.steps.map((step: any, index: number) => (
                  <div key={index} className="pl-10 relative">
                    <div className="absolute left-0 top-1.5 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10">
                      <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h5 className="font-medium text-gray-900 mb-2">{step.name}</h5>
                      <p className="text-sm text-gray-700">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Fallback for simple tech stack list */}
        {coreComponents.length === 0 && (!workflow.steps || workflow.steps.length === 0) && idea?.repository?.languages && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Repository Languages</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(idea.repository.languages).map((language, index) => (
                <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderMetrics = (payload: any) => {
    let acquisitionMetrics = [];
    let activationMetrics = [];
    let retentionMetrics = [];
    let revenueMetrics = [];
    
    // Parse the payload
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        acquisitionMetrics = parsed.acquisitionMetrics || [];
        activationMetrics = parsed.activationMetrics || [];
        retentionMetrics = parsed.retentionMetrics || [];
        revenueMetrics = parsed.revenueMetrics || [];
      } catch (e) {
        // If parsing fails, use default empty values
      }
    } else {
      acquisitionMetrics = payload.acquisitionMetrics || [];
      activationMetrics = payload.activationMetrics || [];
      retentionMetrics = payload.retentionMetrics || [];
      revenueMetrics = payload.revenueMetrics || [];
    }
    
    // Helper function to render a metric category
    const renderMetricCategory = (title: string, metrics: any[], color: string) => {
      if (!metrics || metrics.length === 0) return null;
      
      return (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
          <div className="space-y-3">
            {metrics.map((metric: any, index: number) => {
              const importanceColor = 
                metric.importance === 'high' ? 'bg-red-100 text-red-800' :
                metric.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800';
                
              return (
                <div key={index} className={`border ${color} rounded-lg p-4`}>
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{metric.name}</h5>
                    {metric.importance && (
                      <span className={`text-xs px-2 py-1 rounded-full ${importanceColor}`}>
                        {metric.importance}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">Target: {metric.target}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    };
    
    return (
      <div className="space-y-6">
        {renderMetricCategory('Acquisition Metrics', acquisitionMetrics, 'border-blue-200')}
        {renderMetricCategory('Activation Metrics', activationMetrics, 'border-green-200')}
        {renderMetricCategory('Retention Metrics', retentionMetrics, 'border-purple-200')}
        {renderMetricCategory('Revenue Metrics', revenueMetrics, 'border-orange-200')}
        
        {/* Fallback if no metrics are found */}
        {!acquisitionMetrics.length && !activationMetrics.length && 
         !retentionMetrics.length && !revenueMetrics.length && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <HelpCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No specific metrics defined for this idea yet.</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderRisks = (payload: any) => {
    let risks = [];
    let criticalRisks = [];
    let contingencyPlans = [];
    
    // Parse the payload
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        risks = parsed.risks || [];
        criticalRisks = parsed.criticalRisks || [];
        contingencyPlans = parsed.contingencyPlans || [];
      } catch (e) {
        // If parsing fails, use default empty values
        // Check if it's a simple array of strings
        try {
          risks = JSON.parse(payload);
        } catch (e2) {
          // Not a valid JSON at all
        }
      }
    } else {
      risks = payload.risks || [];
      criticalRisks = payload.criticalRisks || [];
      contingencyPlans = payload.contingencyPlans || [];
    }
    
    // If risks is still empty but we have a string payload, use it directly
    if (risks.length === 0 && typeof payload === 'string') {
      risks = [payload];
    }
    
    // If risks is an array but not of objects, convert to objects
    if (Array.isArray(risks) && risks.length > 0 && typeof risks[0] !== 'object') {
      risks = risks.map(risk => ({ description: risk }));
    }
    
    return (
      <div className="space-y-6">
        {/* Critical Risks */}
        {criticalRisks.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Critical Risks</h4>
            <ul className="space-y-2">
              {criticalRisks.map((risk: string, index: number) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* All Risks */}
        {risks.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
            <div className="space-y-4">
              {risks.map((risk: any, index: number) => {
                // Handle different risk formats
                const description = risk.description || risk;
                const impact = risk.impact || 'medium';
                const probability = risk.probability || 'medium';
                const mitigation = risk.mitigation || '';
                
                const impactColor = 
                  impact === 'high' ? 'bg-red-100 text-red-800' :
                  impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800';
                  
                const probColor = 
                  probability === 'high' ? 'bg-red-100 text-red-800' :
                  probability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800';
                
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h5 className="font-medium text-gray-900 mb-2">{description}</h5>
                    
                    {(impact || probability) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {impact && (
                          <span className={`text-xs px-2 py-1 rounded-full ${impactColor}`}>
                            Impact: {impact}
                          </span>
                        )}
                        {probability && (
                          <span className={`text-xs px-2 py-1 rounded-full ${probColor}`}>
                            Probability: {probability}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {mitigation && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h6 className="text-xs font-medium text-blue-800 mb-1">Mitigation Strategy</h6>
                        <p className="text-sm text-blue-700">{mitigation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Contingency Plans */}
        {contingencyPlans.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Contingency Plans</h4>
            <ul className="list-disc pl-5 space-y-1">
              {contingencyPlans.map((plan: string, index: number) => (
                <li key={index} className="text-sm text-gray-700">{plan}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Fallback if no risks are found */}
        {!risks.length && !criticalRisks.length && !contingencyPlans.length && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <HelpCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No specific risks identified for this idea yet.</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderGoToMarket = (payload: any) => {
    let launchChannels = [];
    let launchHook = '';
    let targetAudience = '';
    let marketingTactics = [];
    let timelineToLaunch = '';
    let successCriteria = [];
    
    // Parse the payload
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        launchChannels = parsed.launchChannels || [];
        launchHook = parsed.launchHook || '';
        targetAudience = parsed.targetAudience || '';
        marketingTactics = parsed.marketingTactics || [];
        timelineToLaunch = parsed.timelineToLaunch || '';
        successCriteria = parsed.successCriteria || [];
      } catch (e) {
        // If parsing fails, use default empty values
      }
    } else {
      launchChannels = payload.launchChannels || [];
      launchHook = payload.launchHook || '';
      targetAudience = payload.targetAudience || '';
      marketingTactics = payload.marketingTactics || [];
      timelineToLaunch = payload.timelineToLaunch || '';
      successCriteria = payload.successCriteria || [];
    }
    
    return (
      <div className="space-y-6">
        {/* Launch Hook */}
        {launchHook && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">Launch Hook</h4>
            <p className="text-purple-700 text-sm">{launchHook}</p>
          </div>
        )}
        
        {/* Target Audience */}
        {targetAudience && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Target Audience</h4>
            <p className="text-blue-700 text-sm">{targetAudience}</p>
          </div>
        )}
        
        {/* Launch Channels */}
        {launchChannels.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Launch Channels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {launchChannels.map((channel: string, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <span className="text-sm text-gray-700">{channel}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Marketing Tactics */}
        {marketingTactics.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Marketing Tactics</h4>
            <ul className="list-disc pl-5 space-y-1">
              {marketingTactics.map((tactic: string, index: number) => (
                <li key={index} className="text-sm text-gray-700">{tactic}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Timeline to Launch */}
        {timelineToLaunch && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Timeline to Launch</h4>
            <p className="text-gray-700 text-sm">{timelineToLaunch}</p>
          </div>
        )}
        
        {/* Success Criteria */}
        {successCriteria.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Success Criteria</h4>
            <ul className="list-disc pl-5 space-y-1">
              {successCriteria.map((criteria: string, index: number) => (
                <li key={index} className="text-sm text-gray-700">{criteria}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  const renderOpportunityAnalysis = (payload: any) => {
    let opportunitySummary = payload;
    
    // If payload is a string, try to parse it
    if (typeof payload === 'string') {
      try {
        opportunitySummary = JSON.parse(payload);
        // Check if it has an opportunitySummary property
        if (opportunitySummary.opportunitySummary) {
          opportunitySummary = opportunitySummary.opportunitySummary;
        }
      } catch (e) {
        // If parsing fails, use the string as is
        return (
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {payload}
          </div>
        );
      }
    } else if (payload.opportunitySummary) {
      opportunitySummary = payload.opportunitySummary;
    }
    
    // Extract data from the opportunity summary
    const {
      opportunityRank,
      problemStatement,
      productVision,
      marketValidation,
      strategicScores,
      repositoryMetadata
    } = opportunitySummary || {};
    
    return (
      <div className="space-y-6">
        {/* Opportunity Rank */}
        {opportunityRank && (
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
            <h4 className="font-medium text-orange-800">Opportunity Score</h4>
            <span className="text-lg font-bold text-orange-700">{opportunityRank}</span>
          </div>
        )}
        
        {/* Problem Statement */}
        {problemStatement && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Problem Statement</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-gray-700 text-sm">{problemStatement}</p>
            </div>
          </div>
        )}
        
        {/* Product Vision */}
        {productVision && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Product Vision</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-gray-700 text-sm">{productVision}</p>
            </div>
          </div>
        )}
        
        {/* Market Validation */}
        {marketValidation && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Market Validation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {marketValidation.validatedDemand && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h5 className="font-medium text-gray-900 mb-2">Validated Demand</h5>
                  <p className="text-sm text-gray-700">{marketValidation.validatedDemand}</p>
                </div>
              )}
              {marketValidation.marketTrend && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h5 className="font-medium text-gray-900 mb-2">Market Trend</h5>
                  <p className="text-sm text-gray-700">{marketValidation.marketTrend}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Strategic Scores */}
        {strategicScores && Object.keys(strategicScores).length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Strategic Scores</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(strategicScores).map(([key, value]) => {
                // Format the key for display
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .replace(/([a-z])([A-Z])/g, '$1 $2');
                
                // Determine score color
                const scoreValue = typeof value === 'string' ? 
                  parseFloat(value.split('/')[0]) : 
                  typeof value === 'number' ? value : 0;
                  
                const scoreColor = 
                  scoreValue >= 7 ? 'text-green-600' :
                  scoreValue >= 4 ? 'text-amber-600' :
                  'text-red-600';
                
                return (
                  <div key={key} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">{formattedKey}</div>
                    <div className={`font-bold ${scoreColor}`}>{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderGenericAnalysis = (payload: any) => {
    // If payload is a string, try to parse it
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        return renderStructuredContent(parsed);
      } catch (e) {
        // If parsing fails, render as plain text
        return (
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {payload}
          </div>
        );
      }
    }
    
    // If payload is already an object, render it
    return renderStructuredContent(payload);
  };
  
  // Helper function to render structured content
  const renderStructuredContent = (content: any) => {
    if (!content) {
      return <div className="text-gray-500 italic">No data available</div>;
    }
    
    if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
      return <div className="text-gray-700">{String(content)}</div>;
    }
    
    if (Array.isArray(content)) {
      if (content.length === 0) {
        return <div className="text-gray-500 italic">No items</div>;
      }
      
      // Check if array contains simple values or objects
      if (typeof content[0] !== 'object' || content[0] === null) {
        return (
          <ul className="list-disc pl-5 space-y-1">
            {content.map((item, index) => (
              <li key={index} className="text-sm text-gray-700">
                {typeof item === 'string' || typeof item === 'number' ? 
                  item : JSON.stringify(item)}
              </li>
            ))}
          </ul>
        );
      }
      
      // Array of objects
      return (
        <div className="space-y-4">
          {content.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              {renderStructuredContent(item)}
            </div>
          ))}
        </div>
      );
    }
    
    // Handle objects
    return (
      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => {
          // Skip internal keys
          if (key.startsWith('_')) return null;
          
          // Format the key for display
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/_/g, ' ');
          
          return (
            <div key={key}>
              <h4 className="font-medium text-gray-900 mb-2">{formattedKey}</h4>
              <div className="pl-4 border-l-2 border-gray-100">
                {renderStructuredContent(value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Find monetization strategy analysis
  const monetizationStrategy = useMemo(() => {
    if (!idea?.analysisResults) return null;
    
    return idea.analysisResults.find(
      analysis => analysis.analysis_type_id === 6
    );
  }, [idea?.analysisResults]);

  // Find tech stack analysis
  const techStack = useMemo(() => {
    if (!idea?.analysisResults) return null;
    
    return idea.analysisResults.find(
      analysis => analysis.analysis_type_id === 7
    );
  }, [idea?.analysisResults]);

  if (loading) {
    return <FullScreenLoader message="Loading idea..." />;
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Idea Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {error || 'The idea you are looking for does not exist or may have been removed.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Ideas</span>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleSaveClick}
                disabled={isSaving}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isSaving
                    ? 'bg-orange-500 text-white opacity-50 cursor-not-allowed'
                    : isSaved
                    ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>
                  {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                </span>
              </button>

              <button
                onClick={handleShareClick}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-transparent opacity-60"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center mb-8">
            {/* Badges */}
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              {idea.isNew && (
                <span className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-full shadow-sm">
                  New
                </span>
              )}
              {idea.isTrending && (
                <span className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-full shadow-sm">
                  🔥 Trending
                </span>
              )}
              {idea.communityPick && (
                <span className="px-3 py-1 text-xs font-medium bg-purple-500 text-white rounded-full shadow-sm">
                  Community Pick
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {idea.title}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              {idea.tagline}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className={`bg-white rounded-lg p-4 shadow-sm border ${getScoreBgColor(idea.opportunityScore)}`}>
                <div className="flex items-center justify-center mb-2">
                  <Zap className={`h-5 w-5 ${getScoreColor(idea.opportunityScore)}`} />
                </div>
                <div className={`text-xl font-bold ${getScoreColor(idea.opportunityScore)}`}>
                  {idea.opportunityScore}/100
                </div>
                <div className="text-xs text-gray-600">Opportunity Score</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-center mb-2">
                  {isRepositoryBased ? (
                    <Github className="h-5 w-5 text-gray-700" />
                  ) : (
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="text-sm font-bold text-gray-900 truncate">
                  {idea.ossProject}
                </div>
                <div className="text-xs text-gray-600">
                  {isRepositoryBased ? 'Repository' : 'OSS Project'}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {idea.license}
                </div>
                <div className="text-xs text-gray-600">License</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Repository Stats */}
      {isRepositoryBased && repositoryStats && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Github className="h-5 w-5 text-gray-700 mr-2" />
              Repository Stats
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatNumber(repositoryStats.stars)}
                </div>
                <div className="text-xs text-gray-600">Stars</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <GitFork className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatNumber(repositoryStats.forks)}
                </div>
                <div className="text-xs text-gray-600">Forks</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatNumber(repositoryStats.watchers)}
                </div>
                <div className="text-xs text-gray-600">Watchers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatNumber(repositoryStats.issues)}
                </div>
                <div className="text-xs text-gray-600">Issues</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Opportunity Overview</h2>
              
              {/* Problem & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    Problem
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {idea.overview?.problem || 'No problem statement available'}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                    Vision
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {idea.overview?.vision || 'No vision statement available'}
                  </p>
                </div>
              </div>
              
              {/* Opportunity Analysis */}
              {analysisData.overview && analysisData.overview.length > 0 && (
                <div className="mt-8">
                  {analysisData.overview.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Market Tab */}
          {activeTab === 'market' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Market Analysis</h2>
              
              {analysisData.market && analysisData.market.length > 0 ? (
                <div>
                  {analysisData.market.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <HelpCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No detailed market analysis available for this idea yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Features Tab */}
          {activeTab === 'features' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Core Features</h2>
              
              {analysisData.features && analysisData.features.length > 0 ? (
                <div>
                  {analysisData.features.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <HelpCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No feature analysis available for this idea yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Tech Stack Tab */}
          {activeTab === 'tech' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Technical Stack & Implementation</h2>
              
              {analysisData.tech && analysisData.tech.length > 0 ? (
                <div>
                  {analysisData.tech.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Code className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No technical stack analysis available for this idea yet.</p>
                  
                  {/* Show repository languages if available */}
                  {idea.repository?.languages && Object.keys(idea.repository.languages).length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Repository Languages</h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        {Object.keys(idea.repository.languages).map((language, index) => (
                          <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Monetization Tab */}
          {activeTab === 'monetization' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Monetization Strategy</h2>
              
              {analysisData.monetization && analysisData.monetization.length > 0 ? (
                <div>
                  {analysisData.monetization.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <DollarSign className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No monetization strategy available for this idea yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Competitive Tab */}
          {activeTab === 'competitive' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Competitive Analysis</h2>
              
              {analysisData.competitive && analysisData.competitive.length > 0 ? (
                <div>
                  {analysisData.competitive.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <TrendingUp className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No competitive analysis available for this idea yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Risks Tab */}
          {activeTab === 'risks' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Risks & Mitigations</h2>
              
              {analysisData.risks && analysisData.risks.length > 0 ? (
                <div>
                  {analysisData.risks.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No risk analysis available for this idea yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Action Items Tab */}
          {activeTab === 'action' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Action Items & Next Steps</h2>
              
              {analysisData.action && analysisData.action.length > 0 ? (
                <div>
                  {analysisData.action.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <CheckCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No action items available for this idea yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Success Metrics & KPIs</h2>
              
              {analysisData.metrics && analysisData.metrics.length > 0 ? (
                <div>
                  {analysisData.metrics.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <BarChart className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No metrics analysis available for this idea yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Go-to-Market Tab */}
          {activeTab === 'gtm' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Go-to-Market Strategy</h2>
              
              {analysisData.gtm && analysisData.gtm.length > 0 ? (
                <div>
                  {analysisData.gtm.map((analysis: any) => (
                    <div key={analysis.id}>
                      {renderAnalysisContent(analysis)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Rocket className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No go-to-market strategy available for this idea yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={idea?.title}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
};

export default IdeaDetail;