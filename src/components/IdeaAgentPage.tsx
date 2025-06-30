import React, { useRef } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Code, 
  BarChart2, 
  FileText, 
  Zap, 
  Clock, 
  Rocket, 
  ArrowRight, 
  Database, 
  DollarSign, 
  Users, 
  Lightbulb
} from 'lucide-react';

const IdeaAgentPage: React.FC = () => {
  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-100 to-purple-300 py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Idea Agent ⚡</h1>
          </div>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl">
            Your AI co-pilot for turning open-source sparks into full startup blueprints.
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl">
            Coming soon: chat with your ideas and get product roadmaps, tech stacks, and go-to-market plans—all in real time.
          </p>
          
          {/* Chat Window Mockup */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full mb-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Idea Agent</h3>
                  <p className="text-xs text-gray-500">AI Co-pilot</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 max-w-[80%]">
                  Hi there! I'm your Idea Agent. How can I help with your startup idea today?
                </div>
              </div>
              
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-purple-100 rounded-lg p-3 text-sm text-gray-700 max-w-[80%]">
                  I want to build a SaaS based on this open-source repository. What's the minimum viable product I should focus on?
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 max-w-[80%]">
                  Based on my analysis of the repository, here's the MVP you should focus on:
                  
                  <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">MVP Core Features:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li>User authentication system</li>
                      <li>Basic dashboard with analytics</li>
                      <li>API integration with key services</li>
                      <li>Simple subscription management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="Ask about tech stack, features, or go-to-market strategy..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled
                />
                <button className="ml-2 p-2 bg-purple-500 text-white rounded-lg opacity-50 cursor-not-allowed">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-lg rotate-12 opacity-20 z-0"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-100 rounded-lg -rotate-12 opacity-20 z-0"></div>
            <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-yellow-100 rounded-lg rotate-45 opacity-20 z-0"></div>
          </div>
          
          <button
            onClick={scrollToWaitlist}
            className="px-8 py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed opacity-80 flex items-center space-x-2">
            <span>👉 Join the Waitlist</span>
            <span className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded">Coming Soon</span>
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your open-source inspiration into a complete startup blueprint.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="pt-2">
                <div className="text-2xl mb-4">🔎</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Paste or pick an OSS repo
                </h3>
                <p className="text-gray-600">
                  We import code, docs, metrics, and analyze the repository structure.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="pt-2">
                <div className="text-2xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chat with your Idea Agent
                </h3>
                <p className="text-gray-600">
                  Ask questions like "What's the MVP?" or "Show me the tech stack" in natural language.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="pt-2">
                <div className="text-2xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Get a "Startup Blueprint"
                </h3>
                <p className="text-gray-600">
                  Receive a complete tech architecture, prompts, timeline, and revenue model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Powerful tools to help you build, launch, and grow your startup.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Interactive Chat 💡</h3>
              </div>
              <p className="text-gray-600">
                Ask anything—product fit, feature list, code snippets, and get instant, contextual responses.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Startup Roadmaps 📈</h3>
              </div>
              <p className="text-gray-600">
                From wireframes to launch: get step-by-step guidance tailored to your specific project.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI-Optimized Prompts 🤖</h3>
              </div>
              <p className="text-gray-600">
                Download ready-to-go CLAUDE.md or GEMINI.md files for continued development with any AI platform.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Database className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Stack Recommendations 🧰</h3>
              </div>
              <p className="text-gray-600">
                Get tailored tech stack recommendations including Supabase auth, n8n flows, and Bolt.new integrations.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Playbooks 💸</h3>
              </div>
              <p className="text-gray-600">
                Access pricing models and integration guides for RevenueCat/Stripe to monetize your product effectively.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Code className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Code Generation 💻</h3>
              </div>
              <p className="text-gray-600">
                Generate production-ready code snippets and components based on your requirements and specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Idea Agent Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Idea Agent?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform offers unique advantages for founders and developers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg mt-1">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Faster</h3>
                  <p className="text-gray-600">
                    Skip planning, go straight to code. Our AI agent handles the heavy lifting so you can focus on what matters.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-lg mt-1">
                  <BarChart2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Validate Instantly</h3>
                  <p className="text-gray-600">
                    Get AI-backed market insights on demand. Test your assumptions and pivot quickly based on data.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg mt-1">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Plug & Play Prompts</h3>
                  <p className="text-gray-600">
                    Get shareable .md templates for any AI platform. Continue your development with Claude, Gemini, or any other AI assistant.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg mt-1">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Team-Ready</h3>
                  <p className="text-gray-600">
                    Export and share blueprints with co-founders or agencies. Keep everyone aligned with a single source of truth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Who It's For
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Idea Agent is designed for a variety of creators and entrepreneurs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Indie Hackers</h3>
              <p className="text-sm text-gray-600">
                Racing to ship side projects and turn them into sustainable businesses.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Early-Stage Founders</h3>
              <p className="text-sm text-gray-600">
                Zeroing in on MVPs and looking to validate their ideas quickly.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No-Code Makers</h3>
              <p className="text-sm text-gray-600">
                Building low-lift SaaS products without extensive coding knowledge.
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dev Teams</h3>
              <p className="text-sm text-gray-600">
                Prototyping clients' proofs of concept and accelerating development cycles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Launch Timeline
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We're working hard to bring Idea Agent to you. Here's our roadmap.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200"></div>
            
            <div className="space-y-12">
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-2 w-6 h-6 rounded-full border-4 border-purple-200 bg-purple-500"></div>
                <div className="ml-auto mr-auto w-full md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                    <h3 className="font-semibold text-gray-900">Q3 2024</h3>
                    <p className="text-gray-600">Expected Launch</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-2 w-6 h-6 rounded-full border-4 border-purple-200 bg-purple-400"></div>
                <div className="ml-auto mr-auto w-full md:w-1/2 md:pl-8 md:ml-auto">
                  <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                    <h3 className="font-semibold text-gray-900">August 2024</h3>
                    <p className="text-gray-600">Beta Opens</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-2 w-6 h-6 rounded-full border-4 border-purple-200 bg-purple-300"></div>
                <div className="ml-auto mr-auto w-full md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                    <h3 className="font-semibold text-gray-900">Now</h3>
                    <p className="text-gray-600">Waitlist Open</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      First 500 get priority access
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={waitlistRef} className="py-16 px-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to chat with your next big idea?</h2>
          <p className="text-lg mb-8 text-purple-100">
            Join our waitlist to get early access to Idea Agent and be among the first to experience the future of startup development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
            />
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto whitespace-nowrap">
              Join Idea Agent Waitlist
            </button>
          </div>
          <p className="text-xs text-purple-200 mt-4">
            No spam, early-access perks, and free build workouts.
          </p>
        </div>
      </section>
    </div>
  );
};

export default IdeaAgentPage;