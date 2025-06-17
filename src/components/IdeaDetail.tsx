import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ExternalLink, 
  Download,
  Zap,
  Users,
  DollarSign,
  Code,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { IdeaData } from '../types';

interface IdeaDetailProps {
  idea: IdeaData;
  onBack: () => void;
}

const IdeaDetail: React.FC<IdeaDetailProps> = ({ idea, onBack }) => {
  const [isSaved, setIsSaved] = useState(idea.isSaved || false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const sections = [
    {
      id: 'overview',
      title: 'Executive Summary',
      icon: Target,
      content: idea.description
    },
    {
      id: 'market',
      title: 'Market & Target Audience',
      icon: Users,
      content: `Market Size: ${idea.marketSize}\n\nTarget Audience: ${idea.targetAudience}`
    },
    {
      id: 'monetization',
      title: 'Monetization Strategy',
      icon: DollarSign,
      content: idea.monetizationStrategy
    },
    {
      id: 'tech',
      title: 'Recommended Tech Stack',
      icon: Code,
      content: idea.techStack.join(', ')
    },
    {
      id: 'advantage',
      title: 'Key Differentiators & Value Add',
      icon: TrendingUp,
      content: idea.competitiveAdvantage
    },
    {
      id: 'risks',
      title: 'Risks & Considerations',
      icon: AlertTriangle,
      content: idea.risks.join('\n• ')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Ideas</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isSaved 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            {/* Badges */}
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              {idea.isNew && (
                <span className="px-3 py-1 text-sm font-medium bg-blue-500 text-white rounded-full">
                  New
                </span>
              )}
              {idea.isTrending && (
                <span className="px-3 py-1 text-sm font-medium bg-red-500 text-white rounded-full">
                  🔥 Trending
                </span>
              )}
              {idea.communityPick && (
                <span className="px-3 py-1 text-sm font-medium bg-purple-500 text-white rounded-full">
                  Community Pick
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{idea.title}</h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">{idea.tagline}</p>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <Zap className={`h-6 w-6 ${getScoreColor(idea.opportunityScore)}`} />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(idea.opportunityScore)}`}>
                  {idea.opportunityScore}/100
                </div>
                <div className="text-sm text-gray-600">Opportunity Score</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <ExternalLink className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-gray-900 truncate">
                  {idea.ossProject}
                </div>
                <div className="text-sm text-gray-600">OSS Project</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {idea.license}
                </div>
                <div className="text-sm text-gray-600">License</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex justify-center flex-wrap gap-2">
            {idea.categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium bg-white text-gray-700 rounded-full shadow-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {section.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Build This Idea?</h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have discovered their next big opportunity through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Export to Notion
            </button>
            <button className="px-6 py-3 bg-orange-700 text-white rounded-lg font-semibold hover:bg-orange-800 transition-colors">
              Save to My Ideas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;