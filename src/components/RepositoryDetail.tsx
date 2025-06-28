
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  GitFork,
  Eye,
  Calendar,
  Github,
  Code,
  AlertTriangle,
} from 'lucide-react';
import { useRepositoryById } from '../hooks/useRepositoryById';
import { useIdeas, convertIdeaToIdeaData } from '../hooks/useIdeas';
import { useSavedIdeas } from '../hooks/useSavedIdeas';
import { useAuth } from '../hooks/useAuth';
import IdeaCard from './IdeaCard';
import FullScreenLoader from './FullScreenLoader';
import ShareModal from './ShareModal';
import AuthModal from './AuthModal';

const RepositoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { repository, loading, error } = useRepositoryById(id);
  const { ideas } = useIdeas();
  const { isIdeaSaved, toggleSaveIdea } = useSavedIdeas();
  const { authState } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isSaved = id ? isIdeaSaved(id) : false;

  const handleSaveClick = async () => {
    if (!authState.user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!id) return;

    setIsSaving(true);
    try {
      await toggleSaveIdea(id);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  // Filter ideas that belong to this repository
  const repositoryIdeas = ideas
    .filter((idea) => idea.repository_id === id)
    .map(convertIdeaToIdeaData);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate language percentages correctly
  const calculateLanguagePercentages = (languages: Record<string, any>) => {
    const total = Object.values(languages).reduce((sum: number, value: any) => sum + Number(value), 0);
    const percentages: Record<string, number> = {};
    
    Object.entries(languages).forEach(([language, value]) => {
      percentages[language] = total > 0 ? (Number(value) / total) * 100 : 0;
    });
    
    return Object.entries(percentages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8); // Show top 8 languages
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-400',
      'TypeScript': 'bg-blue-500',
      'Python': 'bg-green-500',
      'Java': 'bg-red-500',
      'C++': 'bg-purple-500',
      'C#': 'bg-indigo-500',
      'PHP': 'bg-purple-600',
      'Ruby': 'bg-red-600',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-600',
      'Swift': 'bg-orange-500',
      'Kotlin': 'bg-purple-700',
      'Vue': 'bg-green-400',
      'React': 'bg-blue-400',
      'HTML': 'bg-orange-400',
      'CSS': 'bg-blue-600',
      'SCSS': 'bg-pink-500',
      'Shell': 'bg-gray-700',
      'Handlebars': 'bg-amber-600',
      'Dockerfile': 'bg-blue-700',
    };
    return colors[language] || 'bg-gray-400';
  };

  if (loading) {
    return <FullScreenLoader message="Loading..." />;
  }

  if (error || !repository) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Repository Not Found
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error || 'The repository you are looking for does not exist.'}
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

  const languagePercentages = repository.languages 
    ? calculateLanguagePercentages(repository.languages)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </button>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleSaveClick}
                disabled={isSaving}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  isSaving
                    ? 'bg-orange-500 text-white opacity-50 cursor-not-allowed'
                    : isSaved
                    ? 'bg-orange-500 text-white shadow-lg hover:shadow-xl hover:bg-orange-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}>
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''} transition-all`} />
                <span>
                  {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                </span>
              </button>

              <button
                onClick={handleShareClick}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:shadow-md transition-all duration-200 font-medium">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:shadow-lg transition-all duration-200 font-medium">
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">View on GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-words">
              {repository.full_name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
              {repository.description || 'No description available'}
            </p>

            {/* Repository Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {formatNumber(repository.stargazers_count)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Stars</div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GitFork className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {formatNumber(repository.forks_count)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Forks</div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {formatNumber(repository.watchers_count)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Watchers</div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {formatNumber(repository.open_issues_count)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Issues</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Business Ideas - Main Focus */}
        {repositoryIdeas.length > 0 && (
          <div className="mb-8 lg:mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                💡 Business Ideas from this Repository
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover innovative business opportunities and applications inspired by this open-source project
              </p>
              <div className="inline-flex items-center mt-4 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                {repositoryIdeas.length} {repositoryIdeas.length === 1 ? 'idea' : 'ideas'} available
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {repositoryIdeas.slice(0, 6).map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onClick={() => navigate(`/ideas/${idea.id}`)}
                />
              ))}
            </div>

            {repositoryIdeas.length > 6 && (
              <div className="text-center">
                <button className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md hover:shadow-lg">
                  View all {repositoryIdeas.length} business ideas →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Repository Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Topics & Languages - Span 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topics */}
            {repository.topics && repository.topics.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
                  Topics
                </h3>
                <div className="flex flex-wrap gap-3">
                  {repository.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 rounded-full text-sm font-medium border border-orange-200 hover:from-orange-200 hover:to-orange-100 transition-colors cursor-default">
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languagePercentages.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
                  Languages
                </h3>
                <div className="space-y-4">
                  {languagePercentages.map(([language, percentage]) => (
                    <div key={language} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getLanguageColor(language)}`}></div>
                          <span className="font-medium text-gray-800">{language}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${getLanguageColor(language)} transition-all duration-500 group-hover:opacity-80`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Repository Info & Stats - Span 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Repository Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-5 bg-orange-500 rounded-full mr-3"></div>
                Repository Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Created</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(repository.created_at_github)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Last Updated</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(repository.last_commit_at)}
                    </div>
                  </div>
                </div>
                {repository.license_name && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Code className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">License</div>
                      <div className="text-sm text-gray-600">{repository.license_name}</div>
                    </div>
                  </div>
                )}
                {repository.is_archived && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-red-900">Status</div>
                      <div className="text-sm text-red-600">Archived</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-5 bg-orange-500 rounded-full mr-3"></div>
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Data Quality Score</span>
                  <span className="font-bold text-gray-900">
                    {repository.data_quality_score
                      ? `${repository.data_quality_score}/100`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">AI Agent Project</span>
                  <span className={`font-bold px-2 py-1 rounded text-xs ${
                    repository.is_ai_agent_project 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {repository.is_ai_agent_project ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={repository?.full_name}
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

export default RepositoryDetail;
