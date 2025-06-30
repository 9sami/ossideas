import React from 'react';
import { useNavigate } from 'react-router-dom';
import fullLogo from '../assets/full-logo.png';
import { useState } from 'react';
import AuthModal from './AuthModal';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    icon: '💡',
    title: 'Curated Startup Ideas',
    description:
      'Discover high-potential startup ideas generated from trending open-source repositories.',
  },
  {
    icon: '🚀',
    title: 'Monetization Strategies',
    description:
      'Get actionable monetization plans tailored for each idea and project.',
  },
  {
    icon: '🔍',
    title: 'Competitive Analysis',
    description:
      'See how your idea stacks up against existing solutions in the market.',
  },
  {
    icon: '🛠️',
    title: 'Tech Stack Insights',
    description:
      'Explore recommended tech stacks and best practices for each opportunity.',
  },
  {
    icon: '🌎',
    title: 'Community Picks',
    description: 'Browse ideas and projects loved by the OSSIdeas community.',
  },
  {
    icon: '📬',
    title: 'Weekly Digest',
    description: 'Get the latest ideas and insights delivered to your inbox.',
  },
  {
    icon: '📤',
    title: 'Export to Notion/PDF',
    description: 'Easily export ideas and strategies to Notion, PDF, and more.',
  },
  {
    icon: '🤝',
    title: 'Premium Community Access',
    description:
      'Join a private community of founders, hackers, and OSS enthusiasts.',
  },
  {
    icon: '✨',
    title: 'Personalized Recommendations',
    description: 'Get idea suggestions based on your interests and skills.',
  },
];

const useCases = [
  {
    icon: '🧑‍💻',
    title: 'Validate Your OSS Project',
    description:
      'See if your open-source project has startup potential and get actionable next steps.',
  },
  {
    icon: '💼',
    title: 'Find Your Next SaaS Idea',
    description:
      'Browse a curated list of startup ideas ready for execution, based on real OSS trends.',
  },
  {
    icon: '📊',
    title: 'Get Competitive Insights',
    description:
      'Understand the market landscape and see how your idea compares to others.',
  },
  {
    icon: '💸',
    title: 'Monetize Your Code',
    description: 'Unlock monetization strategies for your open-source work.',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { authState } = useAuth();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleGetStartedClick = () => {
    if (authState.user) {
      navigate('/ideas');
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 to-orange-300 py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <img src={fullLogo} alt="OSSIdeas Logo" className="h-16 mb-6" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Discover, Validate, and Launch{' '}
            <span className="text-orange-600">Open Source Startup Ideas</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl">
            OSSIdeas analyzes trending open-source repositories to generate
            actionable startup ideas, monetization strategies, and competitive
            insights—so you can build with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/ideas')}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">
              Explore Ideas
            </button>
          </div>
        </div>
      </section>

      {/* What Our AI Does Section */}
      <section className="py-16 px-4 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            🤖 What Does Our AI Do?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🔎</div>
              <h4 className="font-semibold mb-1">Analyze OSS Repos</h4>
              <p className="text-gray-600 text-center">
                Our AI scans thousands of trending open-source repositories
                across GitHub and other platforms, extracting key signals and
                patterns.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">💡</div>
              <h4 className="font-semibold mb-1">Generate Startup Ideas</h4>
              <p className="text-gray-600 text-center">
                It identifies unique opportunities and generates startup ideas
                based on real-world code, trends, and market gaps.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">💰</div>
              <h4 className="font-semibold mb-1">Suggest Monetization</h4>
              <p className="text-gray-600 text-center">
                For each idea, our AI proposes monetization strategies, pricing
                models, and go-to-market plans tailored to the OSS ecosystem.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">📊</div>
              <h4 className="font-semibold mb-1">Deliver Insights</h4>
              <p className="text-gray-600 text-center">
                You get competitive analysis, tech stack recommendations, and
                actionable insights—instantly, and always up to date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            What You Can Do with OSSIdeas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="py-16 px-4 bg-orange-50 border-t border-b border-orange-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Who Is This For?
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex-1 flex flex-col items-center">
              <div className="text-3xl mb-2">👩‍💻</div>
              <h4 className="font-semibold mb-1">Founders & Indie Hackers</h4>
              <p className="text-gray-600">
                Looking for your next big idea or a way to validate your
                project? Start here.
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-3xl mb-2">🧑‍🔬</div>
              <h4 className="font-semibold mb-1">OSS Maintainers</h4>
              <p className="text-gray-600">
                Unlock new monetization paths and community growth for your
                open-source work.
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-3xl mb-2">💸</div>
              <h4 className="font-semibold mb-1">Investors & Scouts</h4>
              <p className="text-gray-600">
                Spot emerging trends and high-potential projects before anyone
                else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Use Cases Section */}
      <section className="py-16 px-4 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Featured Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="bg-orange-50 rounded-xl shadow p-6 flex flex-col items-center text-center border border-orange-100">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-orange-100 to-orange-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Build Your Next Startup?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Start exploring ideas, submit your project, or join the
            community—OSSIdeas is your launchpad for open-source
            entrepreneurship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/ideas')}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">
              Explore Ideas
            </button>
          </div>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-12 px-4 bg-orange-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Get Started with OSSIdeas Today
          </h2>
          <p className="text-lg text-orange-100 mb-6">
            Sign up for free and unlock a world of open-source startup
            opportunities powered by AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStartedClick}
              className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition border border-orange-200">
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* AuthModal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};

export default LandingPage;
