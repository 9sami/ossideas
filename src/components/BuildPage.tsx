import React, { useRef } from 'react';
import { Hammer, Code, Sparkles, Lightbulb, Rocket, FileCode, Zap, Clock } from 'lucide-react';
import fullLogo from '../assets/full-logo.png';

const BuildPage: React.FC = () => {
  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 to-orange-300 py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center space-x-3 mb-6">
            <Hammer className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Turn Your Ideas Into Reality</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl">
            Our AI-powered build platform helps you transform startup ideas into working products faster than ever before.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              The Ultimate AI Product Suite
            </h2>
            <p className="text-gray-600 mb-6">
              Launching Q3 2025: A comprehensive suite of AI-powered tools to help you build, launch, and scale your startup ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToWaitlist}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md hover:shadow-lg">
                Join Waitlist
              </button>
              <button className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI App Builder Integration Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              AI App Builder Integrations
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Seamlessly connect with the best AI-powered development platforms to build your product in record time.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Bolt */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Bolt.new</h3>
              <p className="text-xs text-gray-500">AI-powered web development</p>
            </div>
            
            {/* Replit */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">⌨️</span>
              </div>
              <h3 className="font-semibold mb-2">Replit</h3>
              <p className="text-xs text-gray-500">Collaborative coding platform</p>
            </div>
            
            {/* MGX */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold mb-2">MGX</h3>
              <p className="text-xs text-gray-500">AI-first development</p>
            </div>
            
            {/* V0 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">V0</h3>
              <p className="text-xs text-gray-500">Design to code platform</p>
            </div>
            
            {/* A0 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold mb-2">A0</h3>
              <p className="text-xs text-gray-500">AI agent development</p>
            </div>
            
            {/* Lovable */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">❤️</span>
              </div>
              <h3 className="font-semibold mb-2">Lovable</h3>
              <p className="text-xs text-gray-500">User-centric AI design</p>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our comprehensive AI product suite provides all the tools you need to go from idea to launch.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-8 flex flex-col">
              <div className="p-3 bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rapid Prototyping</h3>
              <p className="text-gray-600 mb-4">
                Go from concept to working prototype in hours, not weeks. Our AI tools help you quickly visualize and test your ideas.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mt-auto">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Interactive wireframing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Code generation from designs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Instant feedback loop</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow p-8 flex flex-col">
              <div className="p-3 bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Code className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Development</h3>
              <p className="text-gray-600 mb-4">
                Let AI handle the heavy lifting. Generate code, debug issues, and optimize performance automatically.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mt-auto">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>AI-assisted code generation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Smart templates and components</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Automated testing and debugging</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow p-8 flex flex-col">
              <div className="p-3 bg-orange-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Rocket className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Launch & Scale</h3>
              <p className="text-gray-600 mb-4">
                Deploy your product and grow your user base with our integrated tools for launching and scaling your startup.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mt-auto">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>One-click deployment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Growth marketing templates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Analytics and user feedback</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Product Suite Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Product Suite
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Complete AI Toolkit for Founders
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you build better products faster, with less effort and more intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileCode className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Prompt Library</h3>
                  <p className="text-gray-600 mb-4">
                    Access our curated library of prompts for Claude, Gemini, and other AI models to accelerate your development process.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Specialized prompts for different project types</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Model-specific optimization techniques</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Prompt chaining for complex workflows</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Templates</h3>
                  <p className="text-gray-600 mb-4">
                    Start with pre-built, customizable templates for common startup needs, from landing pages to full-stack applications.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Industry-specific starter templates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Component libraries for rapid assembly</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>AI customization to match your brand</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Idea Refiner</h3>
                  <p className="text-gray-600 mb-4">
                    Refine your startup ideas with AI-powered feedback, market analysis, and competitive insights.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Automated market validation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Feature prioritization assistance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Target audience analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Rocket className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Launch Accelerator</h3>
                  <p className="text-gray-600 mb-4">
                    Tools and resources to help you launch your product faster and more effectively.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Go-to-market strategy generator</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Marketing copy and assets creation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Launch checklist and timeline</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Launch Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Clock className="h-4 w-4 mr-2" />
            Coming Soon
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Expected Launch: Q3 2025
          </h2>
          <p className="text-gray-600 mb-8">
            We're working hard to bring you the best AI-powered build tools. Join our waitlist to get early access and exclusive updates.
          </p>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-md p-4 inline-flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Development in progress</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={waitlistRef} className="py-16 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Be First to Build the Future</h2>
          <p className="text-lg mb-8 text-orange-100">
            Join our waitlist to get early access to our AI-powered build platform and shape the future of startup development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 w-full"
            />
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto whitespace-nowrap">
              Join Waitlist
            </button>
          </div>
          <p className="text-xs text-orange-200 mt-4">
            We'll never share your email. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BuildPage;