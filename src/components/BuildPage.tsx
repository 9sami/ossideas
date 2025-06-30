import React from 'react';
import { Hammer, Code, Sparkles, Lightbulb, Rocket, FileCode } from 'lucide-react';
import fullLogo from '../assets/full-logo.png';

const BuildPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 to-orange-300 py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center space-x-3 mb-6">
            <Hammer className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Build Your Ideas</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl">
            Coming soon! We're building tools to help you transform your ideas into reality with AI-powered assistance.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              AI-Powered Build Tools Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We're working on a suite of tools to help you build your ideas faster and more efficiently. Stay tuned for updates!
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800">
                Want early access? Join our waitlist to be the first to know when our build tools are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            What's Coming to the Build Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-full mb-4">
                <FileCode className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Prompt Templates</h3>
              <p className="text-gray-600">
                Access specialized prompts for Claude, Gemini, and other AI models to help refine and develop your ideas.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-green-100 rounded-full mb-4">
                <Code className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI App Builder Integration</h3>
              <p className="text-gray-600">
                Seamless integration with tools like Bolt and Replit to quickly prototype and build your ideas.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 rounded-full mb-4">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Idea Refinement</h3>
              <p className="text-gray-600">
                AI-powered tools to help you refine your ideas, identify market opportunities, and develop a solid business plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Build Platform Roadmap
          </h2>
          <div className="space-y-8">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-orange-300 ml-0.5"></div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg z-10">
                  1
                </div>
                <div className="ml-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Q3 2025: AI Prompt Library</h3>
                  <p className="text-gray-600 mb-2">
                    Launch our comprehensive library of AI prompts for different models and use cases.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Claude-specific prompts for business analysis</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Gemini prompts for technical implementation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Specialized prompts for different industries and use cases</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-orange-300 ml-0.5"></div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg z-10">
                  2
                </div>
                <div className="ml-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Q4 2025: AI Builder Integrations</h3>
                  <p className="text-gray-600 mb-2">
                    Integrate with popular AI app builders to streamline the development process.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Bolt.new integration for rapid prototyping</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Replit integration for collaborative development</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>One-click deployment options for your projects</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg z-10">
                  3
                </div>
                <div className="ml-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Q1 2026: Full Build Platform</h3>
                  <p className="text-gray-600 mb-2">
                    Launch our complete build platform with advanced features and integrations.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>End-to-end idea to implementation pipeline</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>AI-assisted code generation and review</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Community collaboration and feedback tools</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Waitlist</h2>
          <p className="text-lg mb-8 text-orange-100">
            Be the first to know when our build tools are ready. Get early access and help shape the future of AI-powered development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 w-full sm:w-auto"
            />
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
              Join Waitlist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuildPage;